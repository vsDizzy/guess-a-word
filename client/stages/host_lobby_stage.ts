import { ClientCommands } from '../../protocol/client_commands.ts'
import { CommandsManager } from '../../protocol/commands_manager.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { ClientConnection } from '../client_connection.ts'
import { HostRoundStage } from './host_round_stage.ts'
import { LobbyStage } from './lobby_stage.ts'

export class HostLobbyStage implements CommandsManager {
  handlers = {
    input: this.onUserInput,
    [ClientCommands.started]: this.onStartedAsHost,
    [ClientCommands.ended]: this.onStartAsHostFailed,
  }

  constructor(private connection: ClientConnection, private playerId: number) {
    console.log('Input a word to guess:')
  }

  async onUserInput(word: string) {
    if (!this.connection.validateWord(word)) {
      return
    }

    console.log('Starting new round...')
    await this.connection.notify(
      ServerCommands.startAsHost,
      this.playerId,
      word,
    )
  }

  onStartedAsHost() {
    console.log('Started Round as Host')
    this.connection.stage = new HostRoundStage(this.connection)
  }

  onStartAsHostFailed() {
    console.log('Could not create a game. Restarting.\n')
    this.connection.stage = new LobbyStage(this.connection)
  }
}
