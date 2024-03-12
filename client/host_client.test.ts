import { assertEquals } from 'std/assert/assert_equals.ts'
import { RpcNotification } from '../rpc/rpc_types.ts'
import { HostClient, HostMethods } from './host_client.ts'

class TestClient extends HostClient {
  constructor() {
    super()
    Object.assign(this.rpcHandlers, { close: this.close })
  }
}

Deno.test('error', async () => {
  const tc = new TestClient()
  const rs = ReadableStream.from([
    new RpcNotification(HostMethods.error, 'Game error'),
  ]).pipeThrough(tc.rpcSink)

  const actual = await Array.fromAsync(rs)
  assertEquals(actual, [])
})

Deno.test('notifyProgress', async (t) => {
  await t.step('starts new game', async () => {
    const tc = new TestClient()
    const rs = ReadableStream.from([
      new RpcNotification(HostMethods.notifyProgress),
      new RpcNotification('close'),
    ]).pipeThrough(tc.rpcSink)

    await Array.fromAsync(rs)
    assertEquals(tc.progress, 0)
  })

  await t.step('counts attempts', async () => {
    const tc = new TestClient()
    const rs = ReadableStream.from([
      new RpcNotification(HostMethods.notifyProgress),
      new RpcNotification(HostMethods.notifyProgress),
      new RpcNotification('close'),
    ]).pipeThrough(tc.rpcSink)

    await Array.fromAsync(rs)
    assertEquals(tc.progress, 1)
  })
})

Deno.test('notifyEnd', async () => {
  const tc = new TestClient()
  const rs = ReadableStream.from([
    new RpcNotification(HostMethods.notifyEnd),
  ]).pipeThrough(tc.rpcSink)

  const actual = await Array.fromAsync(rs)
  assertEquals(actual, [])
})
