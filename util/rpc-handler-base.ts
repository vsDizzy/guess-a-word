import { toTransformStream } from 'std/streams/to_transform_stream.ts'

export interface RpcRequest {
  command: string
  args?: unknown[]
}

export type RpcResponse =
  | { result: unknown; error?: undefined }
  | { result?: undefined; error: unknown }

export abstract class RpcHandlerBase {
  get stream() {
    return toTransformStream(this.commandHandler.bind(this))
  }

  protected abstract rpcHandlers: {
    [k: string]: unknown
  }

  private closed = false

  private async *commandHandler(src: ReadableStream<RpcRequest>) {
    const reader = src.getReader()
    try {
      while (!this.closed) {
        const rr = await reader.read()
        if (rr.done) {
          throw new Error('Enxpected end of stream.')
        }
        const req = rr.value

        const handler = this.rpcHandlers[req.command] as (
          ...args: unknown[]
        ) => unknown
        if (!handler) {
          throw new Error(`Unexpected command: ${req.command}`)
        }

        try {
          yield {
            result: await handler.bind(this)(...(req.args ?? [])),
          } satisfies RpcResponse
        } catch (e) {
          yield { error: e } satisfies RpcResponse
        }
      }
    } finally {
      reader.releaseLock
    }
  }

  close() {
    this.closed = true
  }
}
