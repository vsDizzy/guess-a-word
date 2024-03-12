import { assertEquals } from 'std/assert/assert_equals.ts'
import { toTransformStream } from 'std/streams/to_transform_stream.ts'
import { RpcNotification } from '../rpc/rpc_types.ts'
import {
  PlayerConnection,
  PlayerConnectionMethods,
} from './player_connection.ts'

class TestConnection extends PlayerConnection {
  constructor() {
    super()
    Object.assign(this.rpcHandlers, { close: this.close })
  }
}

Deno.test('error', async () => {
  const tc = new TestConnection()
  const rs = ReadableStream.from([
    new RpcNotification(PlayerConnectionMethods.error, 'Game error'),
  ]).pipeThrough(tc.rpcSink)

  const actual = await Array.fromAsync(rs)
  assertEquals(actual, [])
})

Deno.test.ignore('startGame', async () => {
  const tc = new TestConnection()
  const ts = toTransformStream(startGame)
  // await ts.readable.pipeThrough(tc.stream).pipeTo(
  //   ts.writable,
  // )

  // deno-lint-ignore require-yield
  async function* startGame(src: ReadableStream<RpcNotification>) {}
})
