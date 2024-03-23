import { SeverConnection } from './server_connection.ts'

export class ServerGame {
  wrongTries = 0

  constructor(
    public hostConnection: SeverConnection,
    public guestConnection: SeverConnection,
  ) {}

  progress() {
    this.wrongTries++
  }

  givedUp() {
    this.hostConnection.host.games.push({
      wrongTries: this.wrongTries,
      hostIsWinner: true,
    })
    this.hostConnection.wins++
  }

  win() {
    this.hostConnection.host.games.push({
      wrongTries: this.wrongTries,
      hostIsWinner: false,
    })
    this.guestConnection.wins++
  }
}
