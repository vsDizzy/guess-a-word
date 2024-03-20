import { ArgTypes } from './arg_types.ts'

export class ArgsReader {
  private readers: Record<string, (this: this) => unknown> = {
    [ArgTypes.byte]: this.readByte,
    [ArgTypes.array]: this.readArray,
    [ArgTypes.string]: this.readString,
  }

  constructor(private reader: AsyncIterator<number>) {}

  public async read(...args: ArgTypes[]) {
    return await Array.fromAsync(this.readArgs(args))
  }

  private async *readArgs(args: Iterable<ArgTypes>) {
    for (const arg of args) {
      yield await this.readers[arg].call(this)
    }
  }

  private async readByte() {
    const { done, value } = await this.reader.next()
    if (done) {
      throw new Error('Unexpected end of stream.')
    }

    return value
  }

  private async readArray() {
    const length = await this.readByte()

    return Array.fromAsync(this.readBytes(length))
  }

  private async *readBytes(length: number) {
    while (length--) {
      yield await this.readByte()
    }
  }

  private async readString() {
    const data = await Array.fromAsync(this.readBytesUntilZero())

    return new TextDecoder().decode(Uint8Array.from(data))
  }

  private async *readBytesUntilZero() {
    while (true) {
      const c = await this.readByte()
      if (!c) {
        break
      }

      yield c
    }
  }
}
