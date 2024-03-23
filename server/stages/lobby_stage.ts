import { isDefined } from '../../misc-helpers/misc-helpers.ts'
import { ClientCommands } from '../../protocol/client_commands.ts'
import { CommandsManager } from '../../protocol/commands_manager.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { SeverConnection } from '../server_connection.ts'
import { ServerGame } from '../server_game.ts'
import { GuestStage } from './guest_stage.ts'
import { HostStage } from './host_stage.ts'

export class LobbyStage implements CommandsManager {
  handlers = {
    [ServerCommands.getOpponents]: this.getOpponents,
    [ServerCommands.startAsHost]: this.startAsHost,
  }

  constructor(public connection: SeverConnection) {}

  async getOpponents() {
    const opponents = [...this.connection.host.slots.values()].filter(
      isDefined,
    ).filter(
      (c) => c instanceof LobbyStage && c != this.connection,
    ).map((c) => c.id)

    await this.connection.notify(ClientCommands.gotOpponents, [opponents])
  }

  startAsHost(guestId: number, word: string) {
    const guestConnection = this.connection.host.slots[guestId]
    if (!guestConnection) {
      throw new Error('Guest connection closed.')
    }

    const game = new ServerGame(this.connection, guestConnection)
    this.connection.stage = new HostStage(game)
    guestConnection.stage = new GuestStage(game, word)
  }
}
