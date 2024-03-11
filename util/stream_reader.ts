export class StreamReader<T> {
  private reader: ReadableStreamDefaultReader<T>

  constructor(src: ReadableStream<T>) {
    this.reader = src.getReader()
  }

  async read() {
    const rr = await this.reader.read()
    if (rr.done) {
      throw new Error('Unexpected end of stream.')
    }

    return rr.value
  }

  close() {
    this.reader.releaseLock()
  }
}
