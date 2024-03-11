import { RpcHandlerBase } from '../rpc/rpc_handler_base.ts'

export enum PlayerMethods {
  error = 'error',
  message = 'message',
  notifyStart = 'notifyStart',
  notifyEnd = 'notifyEnd',
}

export class PlayerClient extends RpcHandlerBase {
  protected rpcHandlers = {
    [PlayerMethods.error]: this.error,
    [PlayerMethods.message]: this.message,
    [PlayerMethods.notifyStart]: this.notifyStart,
    [PlayerMethods.notifyEnd]: this.notifyEnd,
  }

  error(msg: string) {
    console.error('Stopping game:', msg)
    this.close()
  }

  message(msg: string) {
    console.log('Message:', msg)
  }

  notifyStart() {
    console.log('New game started.')
  }

  notifyEnd() {
    console.log('Congratulations !!!')
    this.close()
  }
}
