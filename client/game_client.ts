import { mergeReadableStreams, toTransformStream } from 'std/streams/mod.ts'
import { RpcRequest } from '../rpc/rpc_handler.ts'
import { RpcHandler } from '../rpc/rpc_handler.ts'

export enum ServerMethods {
  listOpponents,
  makeMatch,
}

export enum PlayerMethods {
  startHost,
  startPlayer,
  hint,
  endMatch,
}

export class PlayerClient {
  exit = false

  matchStarted = false
  isHost = false

  sink = toTransformStream(this.main.bind(this))
  rpcSink = new RpcHandler({
    ['error']: this.error.bind(this),
    [PlayerMethods.startHost]: this.startHost.bind(this),
  }).sink

  private reset() {
    this.matchStarted = false
    this.isHost = false
  }

  private error(msg: string) {
    console.error('Error:', msg)
    this.exit = true
  }

  private startHost() {
  }

  private hint(msg: string) {
    console.log('Hint:', msg)
  }

  private gameStart() {
    console.log('New game started.')
    this.matchStarted = true
  }

  private gameEnd() {
    console.log('Congratulations !!!')
    this.matchStarted = false
  }

  async *main(
    src: ReadableStream<string>,
  ): AsyncGenerator<RpcRequest> {
    yield { method: ServerMethods.listOpponents }

    if (yield* this.matchmaking(src)) {
      return
    }
  }

  async *matchmaking(
    src: ReadableStream<string>,
  ): AsyncGenerator<RpcRequest, ReadableStream<string> | undefined> {
    for await (const input of src.values({ preventCancel: true })) {
      if (this.exit) {
        return
      }

      if (this.matchStarted) {
        return mergeReadableStreams(ReadableStream.from([input]), src)
      }

      const id = Number(input)
      if (Number.isInteger(id)) {
        yield { method: ServerMethods.makeMatch, args: [id] }
        return
      }

      yield { method: ServerMethods.listOpponents }
    }

    return
  }
}
