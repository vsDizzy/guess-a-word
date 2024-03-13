export async function readOne<T>(items: ReadableStream<T>) {
  return (await readMany(items, 1))[0]
}

export async function readMany<T>(items: ReadableStream<T>, length: number) {
  return await Array.fromAsync(read())

  async function* read() {
    for await (const item of items.values({ preventCancel: true })) {
      yield item
      if (!--length) {
        break
      }
    }
  }
}
