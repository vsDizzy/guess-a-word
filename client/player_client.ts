import { toTransformStream } from 'std/streams/to_transform_stream.ts'
import { RpcHandlerBase } from '../rpc/rpc_handler_base.ts'

export enum PlayerMethods {
  error = 'error',
  message = 'message',
  notifyStart = 'notifyStart',
  notifyEnd = 'notifyEnd',
}

export class PlayerClient extends RpcHandlerBase {
  get inputSink() {
    return toTransformStream(this.input.bind(this))
  }

  protected rpcHandlers = {
    [PlayerMethods.error]: this.error,
    [PlayerMethods.message]: this.message,
    [PlayerMethods.notifyStart]: this.notifyStart,
    [PlayerMethods.notifyEnd]: this.notifyEnd,
  }

  private error(msg: string) {
    console.error('Stopping game:', msg)
    this.close()
  }

  private message(msg: string) {
    console.log('Message:', msg)
  }

  private notifyStart() {
    console.log('New game started.')
  }

  private notifyEnd() {
    console.log('Congratulations !!!')
    this.close()
  }

  // deno-lint-ignore require-yield
  private async *input(src: ReadableStream<string>) {
    for await (const c of src) {
      console.log(c)
    }
  }
}
