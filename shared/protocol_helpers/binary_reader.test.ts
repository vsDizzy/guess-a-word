import { assertEquals, assertIsError, assertRejects } from 'std/assert/mod.ts'
import { BinaryReader } from './binary_reader.ts'

Deno.test('reads bytes', async () => {
  const src = [1, 2, 3]
  const reader = new BinaryReader(ReadableStream.from(src).values())

  const bytes = await Array.fromAsync([
    reader.readByte(),
    reader.readByte(),
    reader.readByte(),
  ])
  assertEquals(bytes, [1, 2, 3])
})

Deno.test('throws when there are no more bytes to read', async () => {
  const src = [1]
  const reader = new BinaryReader(ReadableStream.from(src).values())

  const error = await assertRejects(() =>
    Array.fromAsync([
      reader.readByte(),
      reader.readByte(),
    ])
  )
  assertIsError(error, Error, /unexpected/i)
})

Deno.test('reads byte arrays', async () => {
  const src = [3, 1, 2, 3, 4, 5]
  const reader = new BinaryReader(ReadableStream.from(src).values())

  const actual = await reader.readByteArray()
  assertEquals(actual, [1, 2, 3])
})

Deno.test('reads strings', async () => {
  const src = ReadableStream.from(new TextEncoder().encode('testing\0'))
  const reader = new BinaryReader(ReadableStream.from(src).values())

  const actual = await reader.readString()
  assertEquals(actual, 'testing')
})
