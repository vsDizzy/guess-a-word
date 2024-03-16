import { assertEquals } from 'std/assert/assert_equals.ts'
import { ObjectKind, ObjectsReader } from './objects_reader.ts'

Deno.test('reads objects sequence', async () => {
  const src = [1, 2, 3, 4, ...new TextEncoder().encode('testing\0')]
  const reader = new ObjectsReader(ReadableStream.from(src).values())

  const bytes = await reader.read([
    ObjectKind.byte,
    ObjectKind.byteArray,
    ObjectKind.string,
  ])
  assertEquals(bytes, [1, [3, 4], 'testing'])
})
