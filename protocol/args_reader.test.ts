import { assertEquals, assertIsError, assertRejects } from 'std/assert/mod.ts'
import { ArgTypes } from './arg_types.ts'
import { ArgsReader } from './args_reader.ts'

Deno.test('reads numbers', async () => {
  const src = ReadableStream.from([1, 2, 3]).values()
  const reader = new ArgsReader(src)

  const args = await reader.read(
    ArgTypes.byte,
    ArgTypes.byte,
    ArgTypes.byte,
  )
  assertEquals(args, [1, 2, 3])
})

Deno.test('throws when there are no more bytes to read', async () => {
  const src = ReadableStream.from([1, 2]).values()
  const reader = new ArgsReader(src)

  const error = await assertRejects(() =>
    reader.read(
      ArgTypes.byte,
      ArgTypes.byte,
      ArgTypes.byte,
    )
  )
  assertIsError(error, Error, /unexpected/i)
})

Deno.test('reads arrays', async () => {
  const src = ReadableStream.from([2, 2, 3]).values()
  const reader = new ArgsReader(src)

  const args = await reader.read(
    ArgTypes.array,
  )
  assertEquals(args, [[2, 3]])
})

Deno.test('reads strings', async () => {
  const src = ReadableStream.from(new TextEncoder().encode('testing\0'))
    .values()
  const reader = new ArgsReader(src)

  const args = await reader.read(
    ArgTypes.string,
  )
  assertEquals(args, ['testing'])
})

Deno.test('reads mixed types', async () => {
  const src = ReadableStream.from([
    ...new TextEncoder().encode('testing\0'),
    1,
    2,
    2,
    3,
    4,
  ])
    .values()
  const reader = new ArgsReader(src)

  const args = await reader.read(
    ArgTypes.string,
    ArgTypes.byte,
    ArgTypes.byte,
    ArgTypes.array,
  )
  assertEquals(args, ['testing', 1, 2, [3, 4]])
})
