import { ClientConnection } from './client_connection.ts'

if (import.meta.main) {
  console.log('Connected:')

  const cc = new ClientConnection({
    readable: new ReadableStream(),
    writable: new TransformStream().writable,
  })
  await cc.pump()
}
