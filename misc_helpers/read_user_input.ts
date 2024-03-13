import { readOne } from './read_stream.ts'

const inputStream = Deno.stdin.readable.pipeThrough(new TextDecoderStream())

export async function readUserInput() {
  const res = await readOne(inputStream)
  return res.replace(/\r?\n$/, '')
}
