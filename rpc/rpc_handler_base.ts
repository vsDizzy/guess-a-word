import { toTransformStream } from 'std/streams/to_transform_stream.ts'
import { StreamReader } from '../util/stream_reader.ts'
import {
  isRpcRequest,
  RpcError,
  RpcNotification,
  RpcRequest,
  RpcResult,
} from './rpc_types.ts'

export abstract class RpcHandlerBase {
  get stream() {
    return toTransformStream(this.commandHandler.bind(this))
  }

  protected abstract rpcHandlers: {
    [k: string]: unknown
  }

  private closed = false

  private async *commandHandler(
    src: ReadableStream<RpcRequest | RpcNotification>,
  ) {
    const reader = new StreamReader(src)
    try {
      while (!this.closed) {
        const req = await reader.read()

        const doResponse = isRpcRequest(req)
        console.log(1, doResponse)
        const method = doResponse ? req.request : req.notification
        const handler = this.rpcHandlers[method] as (
          ...args: unknown[]
        ) => unknown
        if (!handler) {
          throw new Error(`No handler is defined for: ${method}`)
        }

        try {
          const res = await handler.bind(this)(...(req.args ?? []))
          if (doResponse) {
            yield new RpcResult(res)
          }
        } catch (e) {
          if (doResponse) {
            yield new RpcError(e)
          }
        }
      }
    } finally {
      reader.close()
    }
  }

  close() {
    this.closed = true
  }
}
