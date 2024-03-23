import { parseArgs } from 'std/cli/mod.ts'
import { LaunchOptions } from '../misc-helpers/misc-helpers.ts'
import { ClientConnection } from './client_connection.ts'
import { LobbyStage } from './stages/lobby_stage.ts'

if (import.meta.main) {
  const options = parseCommandLine()
  await listen(options)
}

function parseCommandLine() {
  const flags = parseArgs(Deno.args, {
    string: ['path', 'host', 'port', 'pass'],
    default: { host: 'localhost', port: 16384, pass: '' },
    alias: { path: 'p', host: 'h', port: 'p' },
  })

  return { ...flags, port: Number(flags.port) }
}

async function listen({ path, host, port, pass }: LaunchOptions) {
  const connection = path
    ? await Deno.connect({ path, transport: 'unix' })
    : await Deno.connect({ hostname: host, port })
  console.log(
    'Connecting to',
    path ? `Unix socket: ${path}` : `TCP socket: ${host}:${port}`,
  )

  const clientConnection = new ClientConnection(connection)
  await clientConnection.auth(pass)
  await Promise.all([
    clientConnection.listen(),
    clientConnection.handleInput(),
    (clientConnection.stage as LobbyStage).newGame(),
  ])
}
