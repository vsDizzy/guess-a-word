import { ArgTypes } from '../protocol/arg_types.ts'
import { ClientCommands } from '../protocol/client_commands.ts'

export const clientArgsTypes: Record<ClientCommands, ArgTypes[]> = {
  [ClientCommands.serverIsFull]: [],
  [ClientCommands.onUnknownMethod]: [],
  [ClientCommands.gotOpponents]: [ArgTypes.array],
  [ClientCommands.started]: [],
  [ClientCommands.progress]: [],
  [ClientCommands.message]: [ArgTypes.string],
  [ClientCommands.won]: [],
  [ClientCommands.ended]: [],
}
