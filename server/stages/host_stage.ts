import { ClientCommands } from '../../protocol/client_commands.ts'
import { CommandsManager } from '../../protocol/commands_manager.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { ServerGame } from '../server_game.ts'

export class HostStage implements CommandsManager {
  handlers = { [ServerCommands.sendMessage]: this.sendHint }

  constructor(public game: ServerGame) {}

  async sendHint(msg: string) {
    await this.game.guestConnection.notify(ClientCommands.message, msg)
  }
}
