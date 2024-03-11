import { assertEquals } from 'std/assert/assert_equals.ts'
import { assertInstanceOf, assertMatch, assertRejects } from 'std/assert/mod.ts'
import { RpcHandlerBase, RpcRequest } from './rpc-handler-base.ts'

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

Deno.test('calls test method', async () => {
  const rs = ReadableStream.from(
    [
      { command: 'test' },
      { command: 'close' },
    ] satisfies RpcRequest[],
  )
  const th = new TestHandler()
  const ds = rs.pipeThrough(th.stream)

  const actual = await Array.fromAsync(ds)
  assertEquals(actual, [{ result: 4 }, { result: undefined }])
})

Deno.test('calls method that throws', async () => {
  const rs = ReadableStream.from(
    [
      { command: 'error' },
      { command: 'close' },
    ] satisfies RpcRequest[],
  )
  const th = new TestHandler()
  const ds = rs.pipeThrough(th.stream)

  const actual = await Array.fromAsync(ds)
  assertEquals(actual, [
    { error: Error('Test error') },
    {
      result: undefined,
    },
  ])
})

Deno.test('throws protocol errors', async () => {
  const rs = ReadableStream.from([
    { command: 'test' } satisfies RpcRequest,
    Promise.reject(new Error('Protocol error')),
  ])
  const th = new TestHandler()
  const ds = rs.pipeThrough(th.stream)

  const actual = Array.fromAsync(ds)
  const error = await assertRejects(() => actual)
  assertInstanceOf(error, Error)
  assertMatch(error.message, /protocol/i)
})
