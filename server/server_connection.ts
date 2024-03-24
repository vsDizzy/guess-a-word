import { toTransformStream } from 'std/streams/to_transform_stream.ts'
import { arrayToBytes } from '../misc-helpers/misc-helpers.ts'
import { ArgTypes } from '../protocol/arg_types.ts'
import { ArgsReader } from '../protocol/args_reader.ts'
import { argsToBytes } from '../protocol/args_to_bytes.ts'
import { bytesToCommands } from '../protocol/bytes_to_commands.ts'
import { ClientCommands } from '../protocol/client_commands.ts'
import { CommandsManager } from '../protocol/commands_manager.ts'
import { ServerCommands } from '../protocol/server_commands.ts'
import { serverArgsTypes } from './server_args_types.ts'
import { ServerHost } from './server_host.ts'
import { LobbyStage } from './stages/lobby_stage.ts'

const serverSignature = 'guess-a-word v0.1.0'

export class SeverConnection {
  stage: CommandsManager = new LobbyStage(this)
  wins = 0

  private src: AsyncIterator<number>
  private writer: WritableStreamDefaultWriter<Uint8Array>

  constructor(
    public host: ServerHost,
    public id: number,
    connection: Deno.Conn,
  ) {
    this.src = connection.readable.pipeThrough(toTransformStream(arrayToBytes))
      .values()
    this.writer = connection.writable.getWriter()
  }

  async auth(password: string) {
    await this.writer.write(new TextEncoder().encode(serverSignature + '\0'))

    const reader = new ArgsReader(this.src)
    const [clientPassword] = await reader.read(ArgTypes.string)
    if (clientPassword !== password) {
      console.log('Wrong password')
      await this.writer.close()
      throw new Error('Wrong password')
    }

    await this.writer.write(Uint8Array.from([this.id]))
    console.log('Authorized, ID:', this.id)
  }

  async listen() {
    for await (
      const { cmd, args } of bytesToCommands(serverArgsTypes, this.src)
    ) {
      if (cmd == ServerCommands.onUnknownMethod) {
        throw new Error(`Client reported unknown method: ${cmd}`)
      }

      const handler = this.stage.handlers[cmd] as (
        ...args: unknown[]
      ) => Promise<void>
      if (!handler) {
        await this.notify(ClientCommands.onUnknownMethod)
        throw new Error(`Unknown method: ${cmd}`)
      }

      await handler.apply(this.stage, args)
    }
  }

  async notify(cmd: ClientCommands, ...args: unknown[]) {
    await this.writer.write(Uint8Array.from([cmd, ...argsToBytes(...args)]))
  }
}
