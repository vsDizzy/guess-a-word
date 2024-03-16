export async function* commandToUint8Array(
  src: AsyncIterable<{ cmd: number; args: unknown[] }>,
) {
  for await (const { cmd, args } of src) {
    yield new Uint8Array([cmd])

    for (const arg of args) {
      if (Array.isArray(arg)) {
        yield new Uint8Array([arg.length, ...arg])
        continue
      }

      if (typeof arg == 'number') {
        yield new Uint8Array([arg])
        continue
      }

      if (typeof arg != 'string') {
        yield new TextEncoder().encode(arg + '\0')
        continue
      }

      throw new Error(`Unknown data type: ${arg}`)
    }
  }
}
