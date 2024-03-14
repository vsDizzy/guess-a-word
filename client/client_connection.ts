// deno-lint-ignore-file require-yield
import { mergeReadableStreams, toTransformStream } from 'std/streams/mod.ts'
import { readUserInput } from '../misc_helpers/read_user_input.ts'
import { PlayerRequest, ServerRequest } from '../misc_helpers/types.ts'
import { readOne } from '../misc_helpers/read_stream.ts'

export enum GameStage {
  preMatch,
  started,
}

export interface GameState {
  stage: GameStage
  isHost: boolean
  tries: number
}

export enum ServerMethods {
  errorUnknownRequest,
  listOpponents,
}

export enum PlayerMethods {
  errorUnknownRequest,
}

const newGame: GameState = {
  stage: GameStage.preMatch,
  isHost: false,
  tries: 0,
}

export class ClientConnection {
  state: GameState = newGame
  rpcSink = toTransformStream(this.rpc.bind(this))

  handlers: { [_: string]: unknown } = {
    [PlayerMethods.errorUnknownRequest]: this.errorUnknownRequest,
  }

  constructor(
    private connection: TransformStream<ServerRequest, PlayerRequest>,
  ) {}

  async pump() {
    await mergeReadableStreams(
      this.connection.readable.pipeThrough(this.rpcSink),
    ).pipeTo(this.connection.writable)
  }

  async *rpc(
    src: ReadableStream<PlayerRequest>,
  ): AsyncGenerator<ServerRequest> {
    for await (const req of src) {
      const handler = this.handlers[req.method]
      if (!handler) {
        yield { method: ServerMethods.errorUnknownRequest, args: [req.method] }
      }

      yield* (handler as (...args: unknown[]) => AsyncGenerator<ServerRequest>)(
        ...(req.args ?? []),
      )
    }
  }

  async *errorUnknownRequest(method: string) {
    console.error('Unknown request:', method)
    throw new Error(`Unknown request: ${method}`)
  }

  async *round(scr: ReadableStream): AsyncGenerator<ServerRequest> {
    const req = await readOne()
    while (true) {
      yield { method: ServerMethods.listOpponents }

      this.state = newGame
      const playerId = Number(await readUserInput())
      console.log('Input:', playerId)
    }
  }
}
