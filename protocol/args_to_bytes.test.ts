import { assertEquals } from 'std/assert/assert_equals.ts'
import { argsToBytes } from './args_to_bytes.ts'

Deno.test('handles numbers', () => {
  const bytes = Array.from(argsToBytes(1, 2, 3))
  assertEquals(bytes, [1, 2, 3])
})

Deno.test('handles arrays', () => {
  const bytes = Array.from(argsToBytes([2, 3]))
  assertEquals(bytes, [2, 2, 3])
})

Deno.test('handles strings', () => {
  const bytes = Array.from(argsToBytes('testing'))
  assertEquals(bytes, [...new TextEncoder().encode('testing\0')])
})

Deno.test('handles empty arguments', () => {
  const bytes = Array.from(argsToBytes())
  assertEquals(bytes, [])
})

Deno.test('handles mixed arguments', () => {
  const bytes = Array.from(argsToBytes([4], 'testing', 1))
  assertEquals(bytes, [1, 4, ...new TextEncoder().encode('testing\0'), 1])
})
