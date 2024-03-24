import { toTransformStream } from 'std/streams/to_transform_stream.ts'
import { arrayToBytes } from '../misc-helpers/misc-helpers.ts'
import { ArgTypes } from '../protocol/arg_types.ts'
import { ArgsReader } from '../protocol/args_reader.ts'
import { argsToBytes } from '../protocol/args_to_bytes.ts'
import { bytesToCommands } from '../protocol/bytes_to_commands.ts'
import { ClientCommands } from '../protocol/client_commands.ts'
import { CommandsManager } from '../protocol/commands_manager.ts'
import { ServerCommands } from '../protocol/server_commands.ts'
import { clientArgsTypes } from './client_args_types.ts'
import { LobbyStage } from './stages/lobby_stage.ts'

export class ClientConnection {
  stage: CommandsManager = new LobbyStage(this)

  private src: AsyncIterator<number>
  private writer: WritableStreamDefaultWriter<Uint8Array>

  constructor(connection: TransformStream<Uint8Array, Uint8Array>) {
    this.src = connection.readable.pipeThrough(toTransformStream(arrayToBytes))
      .values()
    this.writer = connection.writable.getWriter()
  }

  async auth(password: string) {
    const reader = new ArgsReader(this.src)
    const [signature] = await reader.read(ArgTypes.string)
    console.log('Connected:', signature)

    await this.writer.write(new TextEncoder().encode(password + '\0'))
    console.log('Logging in..')

    try {
      const [id] = await reader.read(ArgTypes.byte)
      console.log('ID:', id)

      return id
    } catch {
      console.error('Invalid password.')
      Deno.exit(1)
    }
  }

  async listen() {
    for await (
      const { cmd, args } of bytesToCommands(clientArgsTypes, this.src)
    ) {
      if (cmd == ClientCommands.onUnknownMethod) {
        throw new Error(`Client reported unknown method: ${cmd}`)
      }

      const handler = this.stage.handlers[cmd] as (
        ...args: unknown[]
      ) => Promise<void>
      if (!handler) {
        await this.notify(ServerCommands.onUnknownMethod)
        throw new Error(`Unknown method: ${cmd}`)
      }

      await handler.apply(this.stage, args)
    }
  }

  async notify(cmd: ServerCommands, ...args: unknown[]) {
    await this.writer.write(Uint8Array.from([cmd, ...argsToBytes(...args)]))
  }

  async handleInput() {
    const input = Deno.stdin.readable.pipeThrough(new TextDecoderStream())
    for await (const line of input) {
      const msg = line.replace(/\r?\n$/, '')
      const handler = this.stage.handlers.input as (
        msg: string,
      ) => Promise<void>
      await handler.call(this.stage, msg)
    }
  }

  public validateWord(value: string) {
    const isValid = /^[a-z]+$/i.test(value)
    if (!isValid) {
      console.log('Please type a sigle word:')
    }

    return isValid
  }
}
