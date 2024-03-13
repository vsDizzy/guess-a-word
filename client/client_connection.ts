import { toTransformStream } from 'std/streams/mod.ts'
import { readStream } from '../misc_helpers/read_stream.ts'
import {
  PlayerRequest,
  ServerErrorMessages,
  ServerMethods,
  ServerRequest,
  ServerResponse,
} from '../misc_helpers/types.ts'

export class ClientConnection {
  exit = false

  matchStarted = false
  isHost = false

  roundSink = toTransformStream(this.round.bind(this))

  constructor(
    private connection: TransformStream<
      ServerRequest,
      PlayerRequest | ServerResponse
    >,
  ) {}

  async pump() {
    await this.connection.readable
      .pipeThrough(this.roundSink)
      .pipeTo(this.connection.writable)
  }

  private async *round() {
  }

  private async *callServer(
    src: ReadableStream<unknown>,
    method: ServerMethods,
    ...args: unknown[]
  ) {
    yield { method, args: args ?? [] }
    const res = await readStream(src) as ServerResponse
    if (res.error) {
      throw new Error(ServerErrorMessages[res.error])
    }

    return res.result
  }
}
