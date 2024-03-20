import {
  assertEquals,
  assertIsError,
  assertMatch,
  assertRejects,
} from 'std/assert/mod.ts'
import { toTransformStream } from 'std/streams/to_transform_stream.ts'
import { SeverConnection } from './server_connection.ts'
import { ServerHost } from './server_host.ts'

Deno.test('authorizes clients', async () => {
  const client = new TransformStream()
  const connection = new SeverConnection({} as ServerHost, 1, {
    readable: client.readable.pipeThrough(toTransformStream(clientFlow)),
    writable: client.writable,
  } as Deno.Conn)

  await connection.auth('test')

  async function* clientFlow(src: ReadableStream<Uint8Array>) {
    const reader = src.getReader()

    try {
      const { value: signatureBytes } = await reader.read()
      const signature = new TextDecoder().decode(signatureBytes)
      assertMatch(signature, /guess-a-word/)

      yield new TextEncoder().encode('test\0')
      const { value: idBytes } = await reader.read()

      const id = [...(idBytes ?? [])][0]
      assertEquals(id, 1)
    } finally {
      reader.releaseLock()
    }
  }
})

Deno.test('handles wrong passwords', async () => {
  const client = new TransformStream()
  const connection = new SeverConnection({} as ServerHost, 1, {
    readable: client.readable.pipeThrough(toTransformStream(clientFlow)),
    writable: client.writable,
  } as Deno.Conn)

  const err = await assertRejects(() => connection.auth('test'))
  assertIsError(err, Error, /wrong/i)

  async function* clientFlow(src: ReadableStream<Uint8Array>) {
    const reader = src.getReader()

    try {
      const { value: signatureBytes } = await reader.read()
      const signature = new TextDecoder().decode(signatureBytes)
      assertMatch(signature, /guess-a-word/)

      yield new TextEncoder().encode('wrong\0')
    } finally {
      reader.releaseLock()
    }
  }
})
