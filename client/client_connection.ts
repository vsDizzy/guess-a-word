import { BinaryReader } from '../shared/protocol_helpers/binary_reader.ts'

export class ClientConnection {
  private reader: BinaryReader
  private writer: WritableStreamDefaultWriter<Uint8Array>

  constructor(connection: TransformStream<Uint8Array, number>) {
    this.reader = new BinaryReader(
      connection.readable.values({ preventCancel: true }),
    )
    this.writer = connection.writable.getWriter()
  }

  async auth(password: string) {
    const signature = await this.reader.readString()
    console.log('Connected:', signature)

    await this.writer.write(new TextEncoder().encode(password + '\0'))
    console.log('Logging in..')

    const id = await this.reader.readByte()
    console.log('ID:', id)

    return id
  }
}
