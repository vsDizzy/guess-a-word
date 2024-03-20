export function* argsToBytes(...args: unknown[]) {
  for (const arg of args) {
    if (Array.isArray(arg)) {
      yield* [arg.length, ...arg]
      continue
    }

    if (typeof arg == 'number') {
      yield arg
      continue
    }

    if (typeof arg == 'string') {
      yield* new TextEncoder().encode(arg + '\0')
      continue
    }

    throw new Error(`Unknown data type: ${arg}`)
  }
}
