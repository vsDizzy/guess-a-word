import { ClientCommands } from '../../protocol/client_commands.ts'
import { CommandsManager } from '../../protocol/commands_manager.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { ServerGame } from '../server_game.ts'
import { LobbyStage } from './lobby_stage.ts'

export class GuestStage implements CommandsManager {
  handlers = {
    [ServerCommands.sendMessage]: this.sendMessage,
    [ServerCommands.endGuest]: this.guestGivedUp,
  }

  constructor(
    public game: ServerGame,
    private word: string,
  ) {}

  async sendMessage(word: string) {
    if (word != this.word) {
      await this.game.hostConnection.notify(ClientCommands.progress)
      this.game.progress()
      return
    }

    await this.game.hostConnection.notify(ClientCommands.ended)
    await this.game.guestConnection.notify(ClientCommands.won)
    this.game.win()
    this.newGame()
  }

  async guestGivedUp() {
    await this.game.hostConnection.notify(ClientCommands.won)
    this.game.givedUp()
    this.newGame()
  }

  private newGame() {
    this.game.hostConnection.stage = new LobbyStage(this.game.hostConnection)
    this.game.guestConnection.stage = new LobbyStage(this.game.guestConnection)
  }
}
