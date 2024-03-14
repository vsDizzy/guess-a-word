import { parseArgs } from 'std/cli/mod.ts'
import { ClientConnection } from './client_connection.ts'

interface ListenOptions {
  path?: string
  host: string
  port: number
  pass: string
}

if (import.meta.main) {
  const flags = parseArgs(Deno.args, {
    string: ['path', 'host', 'port', 'pass'],
    default: { host: 'localhost', port: 16384, pass: '' },
    alias: { path: 'p', host: 'h', port: 'p' },
  })

  const options = { ...flags, port: Number(flags.port) }
  await connect(options)
}

async function connect(options: ListenOptions) {
  const { path, host, port } = options
  console.log(
    'Connecting to',
    path ? `Unix socket: ${path}` : `TCP socket: ${host}:${port}`,
  )
  const connection = path
    ? await Deno.connect({ path, transport: 'unix' })
    : await Deno.connect({ hostname: host, port })
  console.log('Connected.')

  await new ClientConnection(connection).pump()
}
