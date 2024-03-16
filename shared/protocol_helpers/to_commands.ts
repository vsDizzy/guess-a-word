import { ObjectKind, ObjectsReader } from './objects_reader.ts'

export async function* toBytes(src: AsyncIterable<Uint8Array>) {
  for await (const c of src) {
    yield* c
  }
}

export async function* bytes_to_commands(
  this: Record<string, ObjectKind[]>,
  src: AsyncIterable<number>,
) {
  const reader = src[Symbol.asyncIterator]()
  while (true) {
    const { done, value: cmd } = await reader.next()
    if (done) {
      break
    }

    const args = await new ObjectsReader(reader).read(this[cmd])
    yield { cmd, args }
  }
}
