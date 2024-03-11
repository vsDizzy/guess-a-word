import { assertEquals } from 'std/assert/assert_equals.ts'
import { RpcRequest } from '../../util/rpc-handler-base.ts'
import { HostCommands, HostPlayer } from './host-player.ts'

class TestPlayer extends HostPlayer {
  constructor() {
    super()
    Object.assign(this.rpcHandlers, { close: this.close })
  }
}

Deno.test('error', async () => {
  const rs = ReadableStream.from(
    [
      { command: HostCommands.error, args: ['Game error'] },
    ] satisfies RpcRequest[],
  )
  const tp = new TestPlayer()
  const ds = rs.pipeThrough(tp.stream)

  const actual = await Array.fromAsync(ds)
  assertEquals(actual, [{ result: undefined }])
})

Deno.test('notifyProgress', async (t) => {
  await t.step('starts new game', async () => {
    const rs = ReadableStream.from(
      [
        { command: HostCommands.notifyProgress },
        { command: 'close' },
      ] satisfies RpcRequest[],
    )
    const tp = new TestPlayer()
    const ds = rs.pipeThrough(tp.stream)

    await Array.fromAsync(ds)
    assertEquals(tp.progress, 0)
  })

  await t.step('counts attempts', async () => {
    const rs = ReadableStream.from(
      [
        { command: HostCommands.notifyProgress },
        { command: HostCommands.notifyProgress },
        { command: 'close' },
      ] satisfies RpcRequest[],
    )
    const tp = new TestPlayer()
    const ds = rs.pipeThrough(tp.stream)

    await Array.fromAsync(ds)
    assertEquals(tp.progress, 1)
  })
})

Deno.test('notifyEnd', async () => {
  const rs = ReadableStream.from(
    [
      { command: HostCommands.notifyEnd },
    ] satisfies RpcRequest[],
  )
  const tp = new TestPlayer()
  const ds = rs.pipeThrough(tp.stream)

  const actual = await Array.fromAsync(ds)
  assertEquals(actual, [{ result: undefined }])
})
