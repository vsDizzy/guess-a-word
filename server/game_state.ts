export class GameState {
  hostId: number | null = null
  guestId: number | null = null
  wrongTries = 0
  hostIsWinner: boolean | null = null
}
