import { parseArgs } from 'std/cli/mod.ts'
import { gamesApi } from './games_api.ts'
import { ServerHost } from './server_host.ts'

interface LaunchOptions {
  path?: string
  host: string
  port: number
  pass: string
  apiPort: number
}

if (import.meta.main) {
  const options = parseCommandLine()
  await listen(options)
}

function parseCommandLine(): LaunchOptions {
  const flags = parseArgs(Deno.args, {
    string: ['path', 'host', 'port', 'pass', 'apiPort'],
    default: { host: 'localhost', port: 16384, pass: '', apiPort: 3000 },
    alias: { path: 'p', host: 'h', port: 'p', apiPort: 'api' },
  })

  return { ...flags, port: Number(flags.port), apiPort: Number(flags.apiPort) }
}

async function listen({ path, host, port, pass, apiPort }: LaunchOptions) {
  const listener = path
    ? Deno.listen({ path, transport: 'unix' })
    : Deno.listen({ hostname: host, port })
  console.log(
    'Listening on',
    path ? `Unix socket: ${path}` : `TCP socket: ${host}:${port}`,
  )

  const serverHost = new ServerHost(pass)
  gamesApi(serverHost.games, apiPort)
  await serverHost.listen(listener)
}
