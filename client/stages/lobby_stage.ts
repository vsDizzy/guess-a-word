import { ClientCommands } from '../../protocol/client_commands.ts'
import { CommandsManager } from '../../protocol/commands_manager.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { ClientConnection } from '../client_connection.ts'
import { GuestRoundStage } from './guest_round_stage.ts'
import { HostLobbyStage } from './host_lobby_stage.ts'

export class LobbyStage implements CommandsManager {
  handlers = {
    input: this.onUserInput,
    [ClientCommands.gotOpponents]: this.onGotOpponents,
    [ClientCommands.started]: this.onStartedAsGuest,
  }

  private opponents: number[] = []

  constructor(private connection: ClientConnection) {}

  async newGame() {
    await this.connection.notify(ServerCommands.getOpponents)
    console.log('--------------------------------')
  }

  onUserInput(msg: string) {
    const id = parseInt(msg)
    if (Number.isInteger(id) && this.opponents.includes(id)) {
      this.connection.stage = new HostLobbyStage(this.connection, id)
      return
    }

    return this.newGame()
  }

  onGotOpponents(opponents: number[]) {
    this.opponents = opponents
    if (!opponents.length) {
      console.log(
        'There are currently no players available. Please wait and press ENTER to refresh.',
      )
      return
    }

    console.log('Opponents:', opponents)
    console.log('\nType Player ID to request a match or wait to be selected:')
  }

  onStartedAsGuest() {
    this.connection.stage = new GuestRoundStage(this.connection)
  }
}
