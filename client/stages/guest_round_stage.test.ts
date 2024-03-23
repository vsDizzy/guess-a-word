import { assertEquals, assertInstanceOf } from 'std/assert/mod.ts'
import { assertSpyCall, assertSpyCalls, spy } from 'std/testing/mock.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { ClientConnection } from '../client_connection.ts'
import { GuestRoundStage } from './guest_round_stage.ts'
import { LobbyStage } from './lobby_stage.ts'

Deno.test('give up', async () => {
  const notify = spy()
  const game = { notify } as unknown as ClientConnection
  const stage = (game.stage = new GuestRoundStage(game))

  await stage.onUserInput('')
  assertInstanceOf(game.stage, LobbyStage)
  assertSpyCalls(notify, 1)

  assertSpyCall(notify, 0, {
    args: [ServerCommands.endGuest],
  })
})

Deno.test('sends word to guess', async () => {
  const notify = spy()
  const game = { notify } as unknown as ClientConnection
  const stage = (game.stage = new GuestRoundStage(game))

  await stage.onUserInput('testing')
  assertEquals(game.stage, stage)
  assertSpyCalls(notify, 1)

  assertSpyCall(notify, 0, {
    args: [ServerCommands.sendMessage, 'testing'],
  })
})

Deno.test('goes back to lobby after a win', () => {
  const notify = spy()
  const game = { notify } as unknown as ClientConnection
  const stage = (game.stage = new GuestRoundStage(game))

  stage.onWon()
  assertInstanceOf(game.stage, LobbyStage)
  assertSpyCalls(notify, 0)
})

Deno.test('counts attempts on progress', () => {
  const notify = spy()
  const game = { notify } as unknown as ClientConnection
  const stage = (game.stage = new GuestRoundStage(game))

  assertEquals(stage.guessAttempts, 0)

  stage.onProgress()
  assertEquals(stage.guessAttempts, 1)

  stage.onProgress()
  stage.onProgress()
  assertEquals(stage.guessAttempts, 3)

  assertEquals(game.stage, stage)
  assertSpyCalls(notify, 0)
})
