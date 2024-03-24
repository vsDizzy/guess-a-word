import { GameState } from './game_state.ts'

export function gamesApi(games: GameState[], port: number) {
  Deno.serve({ port }, () => {
    return Response.json(games)
  })
}
