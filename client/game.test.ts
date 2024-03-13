import { toTransformStream } from 'std/streams/mod.ts'
import { returnsNext, spy } from 'std/testing/mock.ts'
import { ServerRequest } from '../misc_helpers/types.ts'
import { Game } from './game.ts'

Deno.test('start game as a host', async () => {
  const readInput = spy(returnsNext(['y']))

  const ts = toTransformStream(pipeline)
  const cc = new Game(ts.readable, readInput)
  await ts.readable.pipeThrough(cc.roundSink).pipeTo(ts.writable)

  // deno-lint-ignore require-yield
  async function* pipeline(src: ReadableStream<ServerRequest>) {
    const rs = await readStream(src)
    console.log(rs)
  }
})
