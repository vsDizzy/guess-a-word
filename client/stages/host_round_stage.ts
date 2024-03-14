import { PlayerCommands, RpcHost, ServerCommands } from '../../misc/types.ts'
import { ClientGame } from '../client_game.ts'
import { LobbyStage } from './lobby_stage.ts'

export class HostRoundStage implements RpcHost {
  guessAttempts = 0

  handlers = {
    input: this.onUserInput,
    [PlayerCommands.onProgress]: this.onProgress,
    [PlayerCommands.onEnded]: this.onLose,
    [PlayerCommands.onWon]: this.onWin,
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
