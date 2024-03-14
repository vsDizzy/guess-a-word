import { toTransformStream } from 'std/streams/mod.ts'

enum GameStage {
  preMatch,
  started,
}

interface GameState {
  stage: GameStage
  isHost: boolean
  tries: number
}

const newGame: GameState = {
  stage: GameStage.preMatch,
  isHost: false,
  tries: 0,
}

export enum ServerMethods {
  errorUnknownRequest,
  listOpponents,
}

export enum PlayerMethods {
  errorUnknownRequest,
}

export class ClientConnection {
  state: GameState = newGame

  pipeline = toTransformStream(this.pipe)

  constructor(private src: TransformStream) {
  }

  async pump() {
    await this.src.readable.pipeThrough(this.pipeline).pipeTo(this.src.writable)
  }

  async *pipe() {}
}
