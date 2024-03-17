import { toTransformStream } from 'std/streams/to_transform_stream.ts'
import { BinaryReader } from '../shared/protocol_helpers/binary_reader.ts'
import { toBytes } from '../shared/protocol_helpers/to_commands.ts'
import { ServerHost } from './server_host.ts'

const signature = 'guess-a-word v0.1.0'

export class SeverConnection {
  private reader: BinaryReader
  private writer: WritableStreamDefaultWriter<Uint8Array>

  constructor(
    private host: ServerHost,
    private id: number,
    connection: TransformStream<Uint8Array, Uint8Array>,
  ) {
    this.host.slots[id] = this

    this.reader = new BinaryReader(
      connection.readable.pipeThrough(toTransformStream(toBytes)).values(),
    )
    this.writer = connection.writable.getWriter()
  }

  async listen() {
    try {
      await this.auth()
    } finally {
      this.host.slots[this.id] = null
    }
  }

  private async auth() {
    console.log('Client connedted:')
    await this.writer.write(new TextEncoder().encode(signature + '\0'))

    const clientPassword = await this.reader.readString()
    if (clientPassword !== this.host.password) {
      console.log('Wrong password')
      throw new Error('Wrong password')
    }

    await this.writer.write(Uint8Array.from([this.id]))
    console.log('Authorized, ID:', this.id)
  }
}
