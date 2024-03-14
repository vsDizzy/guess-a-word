import { PlayerCommands, RpcHost, ServerCommands } from '../misc/types.ts'
import { LobbyStage } from './stages/lobby_stage.ts'

export class ClientGame {
  private writer: WritableStreamDefaultWriter

  constructor(private connection: TransformStream) {
    this.writer = connection.writable.getWriter()
  }

  stage: RpcHost = new LobbyStage(this)

  async notifyServer(cmd: ServerCommands, ...args: unknown[]) {
    await this.writer.ready
    await this.writer.write({ cmd, args })
  }

  close() {
    return this.writer.close()
  }

  async listen() {
    for await (const { cmd, args } of this.connection.readable) {
      if (cmd == PlayerCommands.onUnknownMethod) {
        console.error('Error: Unknown RPC method.')
        throw new Error('Unknown server RPC method called.')
      }

      const method = this.stage.handlers[cmd]
      if (!method) {
        await this.notifyServer(ServerCommands.onUnknownMethod)
      }
      await method(...args)
    }
  }
}