import { toTransformStream } from 'std/streams/to_transform_stream.ts'
import { ObjectKind } from './protocol_helpers/objects_reader.ts'
import { bytes_to_commands, toBytes } from './protocol_helpers/to_commands.ts'
import { commandToUint8Array } from './protocol_helpers/to_uint8_arrays.ts'
import { ClientCommands, ServerCommands } from './types.ts'

export const toServerSequence: Record<ServerCommands, ObjectKind[]> = {
  [ServerCommands.onUnknownMethod]: [],
  [ServerCommands.getOpponents]: [],
  [ServerCommands.startAsHost]: [ObjectKind.byte, ObjectKind.string],
  [ServerCommands.sendMessage]: [ObjectKind.string],
  [ServerCommands.endGuest]: [],
}

export const toClientSequence: Record<ClientCommands, ObjectKind[]> = {
  [ClientCommands.onUnknownMethod]: [],
  [ClientCommands.onServerIsFull]: [],
  [ClientCommands.onGotOpponents]: [ObjectKind.byteArray],
  [ClientCommands.onStarted]: [],
  [ClientCommands.onProgress]: [],
  [ClientCommands.onMessage]: [ObjectKind.string],
  [ClientCommands.onWon]: [],
  [ClientCommands.onEnded]: [],
}

export function toCommandStream(
  src: ReadableStream<Uint8Array>,
  isServer: boolean,
) {
  return src.pipeThrough(toTransformStream(toBytes)).pipeThrough(
    toTransformStream(
      bytes_to_commands.bind(isServer ? toServerSequence : toClientSequence),
    ),
  )
}

export function toUint8ArrayStream(
  src: ReadableStream<{ cmd: number; args: unknown[] }>,
) {
  return src.pipeThrough(toTransformStream(commandToUint8Array))
}
