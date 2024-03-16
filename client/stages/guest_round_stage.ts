import { ClientCommands, RpcHost, ServerCommands } from '../../shared/types.ts'
import { ClientGame } from '../client_game.ts'
import { LobbyStage } from './lobby_stage.ts'

export class GuestRoundStage implements RpcHost {
  guessAttempts = 0

  handlers = {
    input: this.onUserInput,
    [ClientCommands.onProgress]: this.onProgress,
    [ClientCommands.onMessage]: this.onHint,
    [ClientCommands.onWon]: this.onWon,
  }

  constructor(private game: ClientGame) {
    console.log('Guess a word, ENTER to give up:')
  }

  async onUserInput(msg: string) {
    if (msg == '') {
      console.log('You gave up. Better luck next time.')
      await this.game.notifyServer(ServerCommands.endGuest)
      this.game.stage = new LobbyStage(this.game)
      return
    }

    await this.game.notifyServer(ServerCommands.sendMessage, msg)
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
    this.game.stage = new LobbyStage(this.game)
  }
}
