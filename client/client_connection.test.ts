import { ClientConnection } from './client_connection.ts'

Deno.test('start game as a host', async () => {
  const input = ReadableStream.from([])
  const out = new TransformStream()
  const cc = new ClientConnection({ readable: input, writable: out.writable })
  const r = await Promise.all([Array.fromAsync(out.readable), cc.pump()])
  console.log('r:', r)
})
