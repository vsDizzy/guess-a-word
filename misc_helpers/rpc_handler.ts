import { toTransformStream } from 'std/streams/mod.ts'
import {
  isRpcRequest,
  isRpcResult,
  RpcMessage,
  RpcResult,
} from './rpc_types.ts'

export class RpcHandler {
  pipeline = toTransformStream(this.rpcPipe.bind(this))
  results = new TransformStream()
  awaitingResults = 0

  constructor(private handlers: { [_: string]: unknown } = {}) {}

  private async *rpcPipe(
    src: ReadableStream<RpcMessage>,
  ) {
    try {
      for await (const req of src) {
        if (isRpcResult(req)) {
          await this.handleResult(req)
          continue
        }

        const emitResult = isRpcRequest(req)
        const method = emitResult ? req.method : req.notification
        const handler = this.handlers[method]
        if (!handler) {
          throw new Error(`No handler is defined for method: ${method}`)
        }

        try {
          const res = await (handler as (...args: unknown[]) => unknown)(
            ...(req.args ?? []),
          )
          if (emitResult) {
            yield { result: res } as RpcResult
          }
        } catch (e) {
          if (emitResult) {
            yield { error: e.message } as RpcResult
            throw new Error(`Error calling method ${method}`, { cause: e })
          }
        }
      }
      console.log('end')
    } finally {
      await this.results.writable.close()
    }
  }

  private async handleResult(req: RpcResult) {
    if (this.awaitingResults != 1) {
      throw new Error(
        `There should be only one result awaiting, got ${this.awaitingResults}`,
      )
    }

    const wr = this.results.writable.getWriter()
    try {
      await wr.ready
      if (req.error) {
        await wr.abort(req.error)
      } else {
        await wr.write(req.result)
      }
    } finally {
      wr.releaseLock()
      this.awaitingResults--
    }
  }
}
