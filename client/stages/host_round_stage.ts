import { ClientCommands } from '../../protocol/client_commands.ts'
import { CommandsManager } from '../../protocol/commands_manager.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { ClientConnection } from '../client_connection.ts'
import { LobbyStage } from './lobby_stage.ts'

export class HostRoundStage implements CommandsManager {
  guessAttempts = 0

  handlers = {
    input: this.onUserInput,
    [ClientCommands.progress]: this.onProgress,
    [ClientCommands.ended]: this.onLose,
    [ClientCommands.won]: this.onWin,
  }

  constructor(private game: ClientConnection) {
    console.log('You can type a hint:')
  }

  async onUserInput(word: string) {
    await this.game.notify(ServerCommands.sendMessage, word)
  }

  onProgress() {
    this.guessAttempts++
    console.log('Wrong guesses:', this.guessAttempts)
  }

  async onLose() {
    console.log('Words is guessed. You lose!\n')
    const lobbyStage = new LobbyStage(this.game)
    this.game.stage = lobbyStage
    await lobbyStage.newGame()
  }

  async onWin() {
    console.log('Victory! The opponent gave up.\n')
    const lobbyStage = new LobbyStage(this.game)
    this.game.stage = lobbyStage
    await lobbyStage.newGame()
  }
}
