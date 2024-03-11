export class RpcRequest {
  args: unknown[]

  constructor(public request: string, ...args: unknown[]) {
    this.args = args
  }
}

export function isRpcRequest(msg: unknown): msg is RpcRequest {
  const req = msg as RpcRequest
  return Boolean(req.request)
}

export class RpcNotification {
  args: unknown[]

  constructor(public notification: string, ...args: unknown[]) {
    this.args = args
  }
}

export class RpcResult {
  constructor(public result: unknown) {
  }
}

export class RpcError {
  constructor(public error: unknown) {
  }
}
