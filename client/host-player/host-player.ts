import { RpcHandlerBase } from '../../util/rpc-handler-base.ts'

export enum HostCommands {
  error = 'error',
  notifyProgress = 'notifyProgress',
  notifyEnd = 'notifyEnd',
}

export class HostPlayer extends RpcHandlerBase {
  progress: number | null = null

  protected rpcHandlers = {
    [HostCommands.error]: this.error,
    [HostCommands.notifyProgress]: this.notifyProgress,
    [HostCommands.notifyEnd]: this.notifyEnd,
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
