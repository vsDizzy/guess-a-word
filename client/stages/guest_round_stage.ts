import { ClientCommands } from '../../protocol/client_commands.ts'
import { CommandsManager } from '../../protocol/commands_manager.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { ClientConnection } from '../client_connection.ts'
import { LobbyStage } from './lobby_stage.ts'

export class GuestRoundStage implements CommandsManager {
  guessAttempts = 0

  handlers = {
    input: this.onUserInput,
    [ClientCommands.progress]: this.onProgress,
    [ClientCommands.message]: this.onHint,
    [ClientCommands.won]: this.onWon,
  }

  constructor(private connection: ClientConnection) {
    console.log('Guess a word, ENTER to give up:')
  }

  async onUserInput(msg: string) {
    if (msg == '') {
      console.log('You gave up. Better luck next time.')
      await this.connection.notify(ServerCommands.endGuest)
      this.connection.stage = new LobbyStage(this.connection)
      return
    }

    await this.connection.notify(ServerCommands.sendMessage, msg)
  }

  onProgress() {
    this.guessAttempts++
    console.log(
      `${
        this.guessAttempts == 1
          ? 'wrong guess'
          : `${this.guessAttempts} wrong guesses`
      }. Try again:`,
    )
  }

  onHint(message: string) {
    console.log('Hint:', message)
  }

  onWon() {
    console.log('Victory! You guessed the word.\n')
    this.connection.stage = new LobbyStage(this.connection)
    console.log('Press ENTER.')
  }
}
