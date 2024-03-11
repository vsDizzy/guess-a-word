import { RpcHandlerBase } from '../rpc/rpc_handler_base.ts'

export enum HostMethods {
  error = 'error',
  notifyProgress = 'notifyProgress',
  notifyEnd = 'notifyEnd',
}

export class HostClient extends RpcHandlerBase {
  progress: number | null = null

  protected rpcHandlers = {
    [HostMethods.error]: this.error,
    [HostMethods.notifyProgress]: this.notifyProgress,
    [HostMethods.notifyEnd]: this.notifyEnd,
  }

  error(msg: string) {
    console.error('Stopping game:', msg)
    this.close()
  }

  notifyProgress() {
    if (this.progress == null) {
      this.progress = 0
      console.log('New game started.')
      return
    }

    this.progress++
    console.log('Attempt number:', this.progress)
  }

  notifyEnd() {
    console.log('Game over.')
    this.close()
  }
}
