import { assertEquals } from 'std/assert/mod.ts'
import { assertSpyCall, assertSpyCalls, spy } from 'std/testing/mock.ts'
import { ServerCommands } from '../../protocol/server_commands.ts'
import { ClientConnection } from '../client_connection.ts'
import { HostLobbyStage } from './host_lobby_stage.ts'

Deno.test('handles valid word input', async () => {
  const notify = spy()
  const connection = {
    notify,
    validateWord: () => true,
  } as unknown as ClientConnection
  const stage = connection.stage = new HostLobbyStage(connection, 1)

  await stage.onUserInput('testing')
  assertEquals(connection.stage, stage)
  assertSpyCalls(notify, 1)

  assertSpyCall(notify, 0, {
    args: [ServerCommands.startAsHost, 1, 'testing'],
  })
})

Deno.test('handles invalid word input', async () => {
  const notify = spy()
  const connection = {
    notify,
    validateWord: () => false,
  } as unknown as ClientConnection
  const stage = connection.stage = new HostLobbyStage(connection, 1)

  await stage.onUserInput('testing testing')
  assertEquals(connection.stage, stage)
  assertSpyCalls(notify, 0)
})
