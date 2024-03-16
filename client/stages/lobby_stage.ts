import { ClientCommands, RpcHost, ServerCommands } from '../../shared/types.ts'
import { ClientGame } from '../client_game.ts'
import { GuestRoundStage } from './guest_round_stage.ts'
import { HostLobbyStage } from './host_lobby_stage.ts'

export class LobbyStage implements RpcHost {
  handlers = {
    input: this.onUserInput,
    [ClientCommands.onGotOpponents]: this.onGotOpponents,
    [ClientCommands.onStarted]: this.onStartedAsGuest,
  }

  constructor(private game: ClientGame) {}

  async newGame() {
    await this.game.notifyServer(ServerCommands.getOpponents)
  }

  onUserInput(msg: string) {
    const id = Number(msg)
    if (!Number.isInteger(id)) {
      this.game.stage = new HostLobbyStage(this.game, id)
      return
    }

    return this.newGame()
  }

  onGotOpponents(players: number[]) {
    console.log('Players:', players)
    console.log('\nType Player ID to request a match or wait to be selected:')
  }

  onStartedAsGuest() {
    this.game.stage = new GuestRoundStage(this.game)
  }
}
