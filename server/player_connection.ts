import { RpcHandlerBase } from '../rpc/rpc_handler.ts'

export enum PlayerConnectionMethods {
  error = 'error',
}

export class PlayerConnection extends RpcHandlerBase {
  protected rpcHandlers = {
    [PlayerConnectionMethods.error]: this.error,
  }

  error(msg: string) {
    console.error('Error:', msg)
    this.close()
  }
}
