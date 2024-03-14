import { readOne } from './read_stream.ts'

const inputStream = Deno.stdin.readable.pipeThrough(new TextDecoderStream())

export async function readUserInput() {
  const { value } = await inputStream.values({ preventCancel: true }).next()
  return value.replace(/\r?\n$/, '')
}
