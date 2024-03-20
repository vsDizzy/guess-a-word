import {
  ClientCommands,
  RpcHost,
  ServerCommands,
} from '../../misc-helpers/types.ts'
import { ClientGame } from '../client_game.ts'
import { HostRoundStage } from './host_round_stage.ts'
import { LobbyStage } from './lobby_stage.ts'

export class HostLobbyStage implements RpcHost {
  handlers = {
    input: this.onUserInput,
    [ClientCommands.onStarted]: this.onStartedAsHost,
    [ClientCommands.onEnded]: this.onStartAsHostFailed,
  }

  constructor(private game: ClientGame, private playerId: number) {
    console.log('Input a word to guess:')
  }

  async onUserInput(word: string) {
    if (!/^[a-z]+$/i.test(word)) {
      console.log('Please type a sigle word:')
      return
    }

    await this.game.notifyServer(
      ServerCommands.startAsHost,
      this.playerId,
      word,
    )
  }

  onStartedAsHost() {
    this.game.stage = new HostRoundStage(this.game)
  }

  onStartAsHostFailed() {
    console.log('Could not create a game. Restarting.\n')
    this.game.stage = new LobbyStage(this.game)
  }
}
