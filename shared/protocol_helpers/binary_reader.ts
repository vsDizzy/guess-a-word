export class BinaryReader {
  constructor(private reader: AsyncIterator<number>) {
  }

  async readByte() {
    const { done, value } = await this.reader.next()
    if (done) {
      throw new Error('Unexpected end of stream.')
    }

    return value
  }

  async readByteArray() {
    const length = await this.readByte()

    const res = []
    for (let i = 0; i < length; i++) {
      res.push(await this.readByte())
    }

    return res
  }

  async readString() {
    const res = []
    while (true) {
      const c = await this.readByte()
      if (!c) {
        break
      }

      res.push(c)
    }

    return new TextDecoder().decode(Uint8Array.from(res))
  }
}
