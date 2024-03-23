import { assertEquals } from 'std/assert/mod.ts'
import { assertSpyCall, assertSpyCalls, spy } from 'std/testing/mock.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { ClientConnection } from '../client_connection.ts'
import { HostLobbyStage } from './host_lobby_stage.ts'

Deno.test('handles valid word input', async () => {
  const notify = spy()
  const game = { notify } as unknown as ClientConnection
  const stage = game.stage = new HostLobbyStage(game, 1)

  await stage.onUserInput('testing')
  assertEquals(game.stage, stage)
  assertSpyCalls(notify, 1)

  assertSpyCall(notify, 0, {
    args: [ServerCommands.startAsHost, 1, 'testing'],
  })
})

Deno.test('handles invalid word input', async () => {
  const notify = spy()
  const game = { notify } as unknown as ClientConnection
  const stage = game.stage = new HostLobbyStage(game, 1)

  await stage.onUserInput('')
  assertEquals(game.stage, stage)
  assertSpyCalls(notify, 0)

  await stage.onUserInput('hello world')
  assertEquals(game.stage, stage)
  assertSpyCalls(notify, 0)

  await stage.onUserInput('1048576')
  assertEquals(game.stage, stage)
  assertSpyCalls(notify, 0)

  await stage.onUserInput('[+-/test--')
  assertEquals(game.stage, stage)
  assertSpyCalls(notify, 0)
})
