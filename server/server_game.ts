import { ClientCommands, RpcHost, ServerCommands } from '../shared/types.ts'

export class ServerGame {
  stage: RpcHost = new LobbyStage(this)

  private writer: WritableStreamDefaultWriter

  constructor(private connection: TransformStream) {
    this.writer = connection.writable.getWriter()
  }

  async notifyClient(cmd: ClientCommands, ...args: unknown[]) {
    await this.writer.write({ cmd, args })
  }

  close() {
    return this.writer.close()
  }
}

export class LobbyStage implements RpcHost {
  handlers = {
    [ServerCommands.getOpponents]: this.onGetOpponents,
    [ServerCommands.startAsHost]: this.onStartAsHost,
  }

  constructor(private game: ServerGame) {}

  async onGetOpponents() {
    const opponents = [1, 2, 3]
    await this.game.notifyClient(ClientCommands.onGotOpponents, [opponents])
  }

  async onStartAsHost() {
    const sideB = 1
    await this.game.notifyClient(ClientCommands.onStarted)
    const sideA = 2
    await this.game.notifyClient(ClientCommands.onStarted)
  }
}

export class HostRoundStage implements RpcHost {
  handlers = {}

  constructor(private game: ServerGame) {}
}

export class GuestRoundStage implements RpcHost {
  handlers = {}

  constructor(private game: ServerGame) {}
}
