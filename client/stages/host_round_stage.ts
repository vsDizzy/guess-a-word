import { ClientCommands } from '../../protocol/client_commands.ts'
import { CommandsManager } from '../../protocol/commands_manager.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { ClientGame } from '../client_game.ts'
import { LobbyStage } from './lobby_stage.ts'

export class HostRoundStage implements CommandsManager {
  guessAttempts = 0

  handlers = {
    input: this.onUserInput,
    [ClientCommands.progress]: this.onProgress,
    [ClientCommands.ended]: this.onLose,
    [ClientCommands.won]: this.onWin,
  }

  constructor(private game: ClientGame) {
    console.log('You can type a hint:')
  }

  async onUserInput(word: string) {
    await this.game.notifyServer(ServerCommands.sendMessage, word)
  }

  onProgress() {
    this.guessAttempts++
    console.log('Guess number:', this.guessAttempts)
  }

  onLose() {
    console.log('Words is guessed. You lose!\n')
    this.game.stage = new LobbyStage(this.game)
  }

  onWin() {
    console.log('Victory! The opponent gave up.\n')
    this.game.stage = new LobbyStage(this.game)
  }
}
