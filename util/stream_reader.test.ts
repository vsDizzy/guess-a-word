import {
  assertEquals,
  assertInstanceOf,
  assertMatch,
  assertRejects,
} from 'std/assert/mod.ts'
import { StreamReader } from './stream_reader.ts'

Deno.test('stream reader', async () => {
  const rs = ReadableStream.from([1, 2, 3])
  const sr = new StreamReader(rs)

  const actual = await Array.fromAsync([sr.read(), sr.read(), sr.read()])
  assertEquals(actual, [1, 2, 3])
})

Deno.test(`doesn't close underlying stream`, async () => {
  const rs = ReadableStream.from([1, 2, 3])
  const sr = new StreamReader(rs)
  const b1 = await sr.read()
  sr.close()

  const sr2 = new StreamReader(rs)

  const actual = [b1, await sr2.read(), await sr2.read()]
  assertEquals(actual, [1, 2, 3])
})

Deno.test('throws when no more data', async () => {
  const rs = ReadableStream.from([1])
  const sr = new StreamReader(rs)

  const actual = Array.fromAsync([sr.read(), sr.read()])
  const error = await assertRejects(() => actual)
  assertInstanceOf(error, Error)
  assertMatch(error.message, /unexpected/i)
})
