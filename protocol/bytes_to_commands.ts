import { ArgTypes } from './arg_types.ts'
import { ArgsReader } from './args_reader.ts'

export async function* bytesToCommands(
  argsTypes: Record<string, ArgTypes[]>,
  src: AsyncIterator<number>,
) {
  const reader = new ArgsReader(src)

  while (true) {
    const { done, value: cmd } = await src.next()
    if (done) {
      break
    }

    const args = await reader.read(...argsTypes[cmd])
    yield { cmd, args }
  }
}
