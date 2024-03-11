import { RpcHandlerBase } from '../../util/rpc-handler-base.ts'

export enum ClientCommands {
  error = 'error',
  message = 'message',
  notifyStart = 'notifyStart',
  notifyEnd = 'notifyEnd',
}

export class ClientPlayer extends RpcHandlerBase {
  protected rpcHandlers = {
    [ClientCommands.error]: this.error,
    [ClientCommands.message]: this.message,
    [ClientCommands.notifyStart]: this.notifyStart,
    [ClientCommands.notifyEnd]: this.notifyEnd,
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
