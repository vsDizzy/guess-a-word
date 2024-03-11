import { assertEquals } from 'std/assert/assert_equals.ts'
import { RpcRequest } from '../../util/rpc-handler-base.ts'
import { ClientCommands, ClientPlayer } from './client-player.ts'

class TestPlayer extends ClientPlayer {
  constructor() {
    super()
    Object.assign(this.rpcHandlers, { close: this.close })
  }
}

Deno.test('error', async () => {
  const rs = ReadableStream.from(
    [
      { command: ClientCommands.error, args: ['Game error'] },
    ] satisfies RpcRequest[],
  )
  const tp = new TestPlayer()
  const ds = rs.pipeThrough(tp.stream)

  const actual = await Array.fromAsync(ds)
  assertEquals(actual, [{ result: undefined }])
})

Deno.test('message', async () => {
  const rs = ReadableStream.from(
    [
      { command: ClientCommands.message, args: ['Message 1'] },
      { command: ClientCommands.message, args: ['Message 2'] },
      { command: 'close' },
    ] satisfies RpcRequest[],
  )
  const tp = new TestPlayer()
  const ds = rs.pipeThrough(tp.stream)

  const actual = await Array.fromAsync(ds)
  assertEquals(actual, [{ result: undefined }, { result: undefined }, {
    result: undefined,
  }])
})

Deno.test('notifyEnd', async () => {
  const rs = ReadableStream.from(
    [
      { command: ClientCommands.notifyEnd },
    ] satisfies RpcRequest[],
  )
  const tp = new TestPlayer()
  const ds = rs.pipeThrough(tp.stream)

  const actual = await Array.fromAsync(ds)
  assertEquals(actual, [{ result: undefined }])
})
