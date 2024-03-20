import { ArgTypes } from '../protocol/arg_types.ts'
import { ServerCommands } from '../protocol/server_commands.ts'

export const serverArgsTypes: Record<ServerCommands, ArgTypes[]> = {
  [ServerCommands.onUnknownMethod]: [],
  [ServerCommands.getOpponents]: [],
  [ServerCommands.startAsHost]: [ArgTypes.byte, ArgTypes.string],
  [ServerCommands.sendMessage]: [ArgTypes.string],
  [ServerCommands.endGuest]: [],
}
