import {
  assertEquals,
  assertInstanceOf,
  assertMatch,
  assertRejects,
} from 'std/assert/mod.ts'
import { assertSpyCalls, spy } from 'std/testing/mock.ts'
import { RpcHandler } from './rpc_handler.ts'

Deno.test('calls handlers', async () => {
  const test = spy()
  const rh = new RpcHandler({ test }, () => {})
  const rs = ReadableStream.from([
    { method: 'test' },
  ]).pipeThrough(rh.sink)

  const actual = await Array.fromAsync(rs)
  assertEquals(actual, [])
  assertSpyCalls(test, 1)
})

Deno.test('calls error callback', async () => {
  const test = spy(() => {
    throw new Error('test')
  })
  const errHandler = spy()
  const rh = new RpcHandler({ test }, errHandler)
  const rs = ReadableStream.from([
    { method: 'test' },
  ]).pipeThrough(rh.sink)

  const actual = Array.fromAsync(rs)
  const error = await assertRejects(() => actual)
  assertInstanceOf(error, Error)
  assertMatch(error.message, /test/i)
  assertSpyCalls(test, 1)
  assertSpyCalls(errHandler, 1)
})
