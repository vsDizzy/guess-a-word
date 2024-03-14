export interface RpcResult {
  result: unknown
  error?: string
}

export interface RpcRequest {
  method: string
  args?: unknown[]
}

export interface RpcNotification {
  notification: string
  args?: unknown[]
}

export type RpcMessage = RpcResult | RpcRequest | RpcNotification

export function isRpcResult(res: unknown): res is RpcResult {
  return ((res as RpcRequest).method ??
    (res as RpcNotification).notification) == undefined
}

export function isRpcRequest(res: unknown): res is RpcRequest {
  return (res as RpcRequest).method != undefined
}
