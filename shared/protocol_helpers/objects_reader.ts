import { BinaryReader } from './binary_reader.ts'

export enum ObjectKind {
  byte,
  byteArray,
  string,
}

export class ObjectsReader {
  private reader: BinaryReader

  private toReader: Record<ObjectKind, () => Promise<unknown>>

  constructor(reader: AsyncIterator<number>) {
    this.reader = new BinaryReader(reader)
    this.toReader = {
      [ObjectKind.byte]: this.reader.readByte,
      [ObjectKind.byteArray]: this.reader.readByteArray,
      [ObjectKind.string]: this.reader.readString,
    }
  }

  async read(sequence: ObjectKind[]) {
    const res = []
    for (const item of sequence) {
      res.push(await this.toReader[item].call(this.reader))
    }

    return res
  }
}
