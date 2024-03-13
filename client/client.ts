import { ClientConnection } from './client_connection.ts'

if (import.meta.main) {
  const cc = new ClientConnection(new TransformStream())
  await cc.pump()
}
