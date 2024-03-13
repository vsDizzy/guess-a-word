import { toTransformStream } from 'std/streams/to_transform_stream.ts'

export interface RpcRequest {
  method: number
  args?: unknown[]
}

export class RpcHandler {
  sink = toTransformStream(this.listener.bind(this))

  constructor(private handlers: { [_: string]: unknown }) {}

  // deno-lint-ignore require-yield
  private async *listener(
    src: AsyncIterable<RpcRequest>,
  ): AsyncGenerator<never> {
    for await (const { method, args = [] } of src) {
      const handler = this.handlers[method]
      if (!handler) {
        throw new Error(`No handler is defined for: ${method}`)
      }

      try {
        await (handler as (...args: unknown[]) => unknown)(...args)
      } catch (e) {
        const errHandler = this.handlers['error']
        if (errHandler) {
          await (errHandler as (e: unknown) => unknown)(e)
        }

        throw e
      }
    }
  }
}
