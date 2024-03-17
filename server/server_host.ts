import { ClientCommands } from '../shared/types.ts'
import { SeverConnection } from './server_connection.ts'

const maxServerSlots = 0x100

export class ServerHost {
  slots = new Array<SeverConnection | null>(maxServerSlots).fill(null)

  constructor(public password: string) {}

  async listen(listener: Deno.Listener<Deno.Conn>) {
    for await (const connection of listener) {
      this.handleConnection(connection)
    }
  }

  private handleConnection(connection: Deno.Conn) {
    console.log(
      'Connected',
      isUnixAddr(connection.remoteAddr)
        ? connection.remoteAddr.path
        : `${connection.remoteAddr.hostname}:${connection.remoteAddr.port}`,
    )

    const id = this.slots.indexOf(null)
    if (id === -1) {
      console.log('Server is full.')
      this.disconnect(connection)
    }

    new SeverConnection(this, id, connection).listen()
  }

  private async disconnect(connection: Deno.Conn) {
    await connection.write(
      Uint8Array.from([ClientCommands.onServerIsFull]),
    )
    connection.close()
  }
}

function isUnixAddr(addr: Deno.Addr): addr is Deno.UnixAddr {
  return addr.transport === 'unix'
}
