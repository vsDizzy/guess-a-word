import { ClientCommands } from '../../protocol/client_commands.ts'
import { CommandsManager } from '../../protocol/commands_manager.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { ClientGame } from '../client_game.ts'
import { HostRoundStage } from './host_round_stage.ts'
import { LobbyStage } from './lobby_stage.ts'

export class HostLobbyStage implements CommandsManager {
  handlers = {
    input: this.onUserInput,
    [ClientCommands.started]: this.onStartedAsHost,
    [ClientCommands.ended]: this.onStartAsHostFailed,
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
