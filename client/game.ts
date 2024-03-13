import { toTransformStream } from 'std/streams/to_transform_stream.ts'
import { readUserInput } from '../misc_helpers/read_user_input.ts'
import { PlayerRequest, ServerResponse } from '../misc_helpers/types.ts'

export class Game {
  roundSink = toTransformStream(this.round.bind(this))

  constructor(
    private src: ReadableStream<PlayerRequest | ServerResponse>,
    private readInput = readUserInput,
  ) {}

  async *round() {
    const isHostInput = this.readInput(
      'Do you want to host a game, (y/n)?',
      'n',
    )
    if (/^y$/i.test(isHostInput)) {
      yield* this.playHost()
    }

    if (/^n$/i.test(isHostInput)) {
      yield* this.playGuess()
    }
  }

  // deno-lint-ignore require-yield
  async *playHost() {
    console.log('Host')
  }

  // deno-lint-ignore require-yield
  async *playGuess() {
    console.log('Guess')
  }
}
