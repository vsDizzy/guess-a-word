import { assertEquals, assertIsError, assertRejects } from 'std/assert/mod.ts'
import { assertSpyCalls, returnsNext, spy } from 'std/testing/mock.ts'
import { RpcHandler } from './rpc_handler.ts'
import { RpcNotification, RpcRequest, RpcResult } from './rpc_types.ts'

Deno.test('throws on unexpected result', async () => {
  const req = ReadableStream.from([{ result: 4 } as RpcResult])
  const handler = new RpcHandler()
  const res = req.pipeThrough(handler.pipeline)

  const err = await assertRejects(() => Array.fromAsync(res))
  assertIsError(err, Error, /only one/i)
})

Deno.test('process results', async () => {
  const req = ReadableStream.from([{ result: 4 } as RpcResult])
  const handler = new RpcHandler()
  handler.awaitingResults = 1
  const res = req.pipeThrough(handler.pipeline)

  const [results, messages] = await Promise.all([
    Array.fromAsync(handler.results.readable),
    Array.fromAsync(res),
  ])
  assertEquals(results, [4])
  assertEquals(messages, [])
})

Deno.test('process requests', async () => {
  const req = ReadableStream.from([{ method: 'test' } as RpcRequest])
  const handler = new RpcHandler({ test: () => 4 })
  handler.awaitingResults = 1
  const res = req.pipeThrough(handler.pipeline)

  const messages = await Array.fromAsync(res)
  assertEquals(messages, [{ result: 4 } as RpcResult])
})

Deno.test('process notifications', async () => {
  const testMethod = spy(returnsNext([4]))
  const req = ReadableStream.from([{ notification: 'test' } as RpcNotification])
  const handler = new RpcHandler({ test: testMethod })
  handler.awaitingResults = 1
  const res = req.pipeThrough(handler.pipeline)

  const messages = await Array.fromAsync(res)
  assertEquals(messages, [])
  assertSpyCalls(testMethod, 1)
})
