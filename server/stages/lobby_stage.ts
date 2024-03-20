import { isDefined } from '../../misc-helpers/misc-helpers.ts'
import { ClientCommands } from '../../protocol/client_commands.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { GameStage } from '../game_stage.ts'
import { SeverConnection } from '../server_connection.ts'

export class LobbyStage implements GameStage {
  handlers = { [ServerCommands.getOpponents]: this.getOpponents }

  constructor(public connection: SeverConnection) {}

  async getOpponents() {
    const opponents = [...this.connection.host.slots.values()].filter(
      isDefined,
    ).filter(
      (c) => c instanceof LobbyStage && c != this.connection,
    ).map((c) => c.id)

    await this.connection.notify(ClientCommands.gotOpponents, [opponents])
  }
}
