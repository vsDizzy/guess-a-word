import { isUnixAddr } from '../misc-helpers/misc-helpers.ts'
import { ClientCommands } from '../protocol/client_commands.ts'
import { SeverConnection } from './server_connection.ts'

const maxServerSlots = 0x100

export class ServerHost {
  slots = new Array<SeverConnection | null>(maxServerSlots).fill(null)
  games: { wrongTries: number; hostIsWinner: boolean }[] = []

  constructor(private password: string) {}

  async listen(listener: Deno.Listener<Deno.Conn>) {
    for await (const connection of listener) {
      console.log(
        'Connected',
        isUnixAddr(connection.remoteAddr)
          ? connection.remoteAddr.path
          : `${connection.remoteAddr.hostname}:${connection.remoteAddr.port}`,
      )

      const id = this.slots.indexOf(null)
      if (id === -1) {
        console.log('Server is full.')
        this.disconnect(connection) // no wait, so other clients could connect
        continue
      }

      this.handle(connection, id) // no wait, so other clients could connect
    }
  }

  private async disconnect(connection: Deno.Conn) {
    try {
      await connection.write(
        Uint8Array.from([ClientCommands.serverIsFull]),
      )
      connection.close()
    } catch (e) {
      console.log('Error closing connection.', e)
    }
  }

  private async handle(connection: Deno.Conn, id: number) {
    const serverConnection = new SeverConnection(this, id, connection)
    this.slots[id] = serverConnection

    try {
      await serverConnection.auth(this.password)
      await serverConnection.listen()
    } finally {
      connection.close()
      this.slots[id] = null
    }
  }
}
