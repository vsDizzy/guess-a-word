export interface LaunchOptions {
  path?: string
  host: string
  port: number
  pass: string
}

export function isUnixAddr(addr: Deno.Addr): addr is Deno.UnixAddr {
  return addr.transport === 'unix'
}

export async function* arrayToBytes(src: ReadableStream<Uint8Array>) {
  for await (const chunk of src) {
    yield* chunk
  }
}

export function isDefined<T>(value: T | null): value is T {
  return value != null
}
