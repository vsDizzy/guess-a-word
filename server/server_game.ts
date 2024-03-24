import { GameState } from './game_state.ts'
import { SeverConnection } from './server_connection.ts'

export class ServerGame {
  private gameState = new GameState()

  constructor(
    public hostConnection: SeverConnection,
    public guestConnection: SeverConnection,
  ) {
    this.hostConnection.host.games.push(this.gameState)
    this.gameState.hostId = hostConnection.id
    this.gameState.guestId = guestConnection.id
  }

  progress() {
    this.gameState.wrongTries++
  }

  givedUp() {
    this.gameState.hostIsWinner = true
  }

  win() {
    this.gameState.hostIsWinner = false
  }
}
