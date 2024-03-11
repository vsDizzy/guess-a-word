import { assertEquals } from 'std/assert/assert_equals.ts'
import { assertInstanceOf, assertMatch, assertRejects } from 'std/assert/mod.ts'
import { RpcHandlerBase } from './rpc_handler_base.ts'
import { RpcNotification, RpcRequest } from './rpc_types.ts'
import { RpcResult } from './rpc_types.ts'
import { RpcError } from './rpc_types.ts'

class TestHandler extends RpcHandlerBase {
  protected rpcHandlers: {
    [key: string]: <T>(...args: T[]) => unknown
  } = {
    test: this.test,
    close: this.close,
    error: this.error,
  }

  test() {
    return 4
  }

  error() {
    throw new Error('Test error')
  }
}

Deno.test('sends requests', async () => {
  const th = new TestHandler()
  const rs = ReadableStream.from([
    new RpcRequest('test'),
    new RpcNotification('close'),
  ]).pipeThrough(th.stream)

  const actual = await Array.fromAsync(rs)
  assertEquals(actual, [new RpcResult(4)])
})

Deno.test('receives handler errors', async () => {
  const th = new TestHandler()
  const rs = ReadableStream.from([
    new RpcRequest('error'),
    new RpcNotification('close'),
  ]).pipeThrough(th.stream)

  const actual = await Array.fromAsync(rs)
  assertEquals(actual, [new RpcError(Error('Test error'))])
})

Deno.test('sends notifications', async () => {
  const th = new TestHandler()
  const rs = ReadableStream.from([
    new RpcNotification('test'),
    new RpcNotification('close'),
  ]).pipeThrough(th.stream)

  const actual = await Array.fromAsync(rs)
  assertEquals(actual, [])
})

Deno.test('catches protocol errors', async () => {
  const th = new TestHandler()
  const rs = ReadableStream.from([
    new RpcRequest('test'),
    Promise.reject(new Error('Protocol error')),
  ]).pipeThrough(th.stream)

  const actual = Array.fromAsync(rs)
  const error = await assertRejects(() => actual)
  assertInstanceOf(error, Error)
  assertMatch(error.message, /protocol/i)
})
