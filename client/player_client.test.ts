import { assertEquals } from 'std/assert/assert_equals.ts'
import { RpcNotification } from '../rpc/rpc_types.ts'
import { PlayerClient, PlayerMethods } from './player_client.ts'

class TestClient extends PlayerClient {
  constructor() {
    super()
    Object.assign(this.rpcHandlers, { close: this.close })
  }
}

Deno.test('error', async () => {
  const tc = new TestClient()
  const rs = ReadableStream.from([
    new RpcNotification(PlayerMethods.error, 'Game error'),
  ]).pipeThrough(tc.rpcSink)

  const actual = await Array.fromAsync(rs)
  assertEquals(actual, [])
})

Deno.test('message', async () => {
  const tc = new TestClient()
  const rs = ReadableStream.from([
    new RpcNotification(PlayerMethods.message, 'hello'),
    new RpcNotification(PlayerMethods.message, 'world'),
    new RpcNotification('close'),
  ]).pipeThrough(tc.rpcSink)

  const actual = await Array.fromAsync(rs)
  assertEquals(actual, [])
})

Deno.test('notifyEnd', async () => {
  const tc = new TestClient()
  const rs = ReadableStream.from([
    new RpcNotification(PlayerMethods.notifyEnd),
  ]).pipeThrough(tc.rpcSink)

  const actual = await Array.fromAsync(rs)
  assertEquals(actual, [])
})

Deno.test.only('sends input', async () => {
  const pc = new PlayerClient()
  const rs = ReadableStream.from([
    'bird',
  ]).pipeThrough(pc.inputSink)

  const actual = await Array.fromAsync(rs)
  assertEquals(actual, [])
})
