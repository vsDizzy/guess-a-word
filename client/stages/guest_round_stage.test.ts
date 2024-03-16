import { assertEquals, assertInstanceOf } from 'std/assert/mod.ts'
import { assertSpyCall, assertSpyCalls, spy } from 'std/testing/mock.ts'
import { ServerCommands } from '../../shared/types.ts'
import { ClientGame } from '../client_game.ts'
import { GuestRoundStage } from './guest_round_stage.ts'
import { LobbyStage } from './lobby_stage.ts'

Deno.test('give up', async () => {
  const notifyServer = spy()
  const game = { notifyServer } as unknown as ClientGame
  const stage = (game.stage = new GuestRoundStage(game))

  await stage.onUserInput('')
  assertInstanceOf(game.stage, LobbyStage)
  assertSpyCalls(notifyServer, 1)

  assertSpyCall(notifyServer, 0, {
    args: [ServerCommands.endGuest],
  })
})

Deno.test('sends word to guess', async () => {
  const notifyServer = spy()
  const game = { notifyServer } as unknown as ClientGame
  const stage = (game.stage = new GuestRoundStage(game))

  await stage.onUserInput('testing')
  assertEquals(game.stage, stage)
  assertSpyCalls(notifyServer, 1)

  assertSpyCall(notifyServer, 0, {
    args: [ServerCommands.sendMessage, 'testing'],
  })
})

Deno.test('goes back to lobby after a win', () => {
  const notifyServer = spy()
  const game = { notifyServer } as unknown as ClientGame
  const stage = (game.stage = new GuestRoundStage(game))

  stage.onWon()
  assertInstanceOf(game.stage, LobbyStage)
  assertSpyCalls(notifyServer, 0)
})

Deno.test('counts attempts on progress', () => {
  const notifyServer = spy()
  const game = { notifyServer } as unknown as ClientGame
  const stage = (game.stage = new GuestRoundStage(game))

  assertEquals(stage.guessAttempts, 0)

  stage.onProgress()
  assertEquals(stage.guessAttempts, 1)

  stage.onProgress()
  stage.onProgress()
  assertEquals(stage.guessAttempts, 3)

  assertEquals(game.stage, stage)
  assertSpyCalls(notifyServer, 0)
})
