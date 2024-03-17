import { parseArgs } from 'std/cli/mod.ts'
import { ServerHost } from './server_host.ts'

interface ServerOptions {
  path?: string
  host: string
  port: number
  pass: string
}

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

async function listen({ path, host, port, pass }: ServerOptions) {
  const listener = path
    ? Deno.listen({ path, transport: 'unix' })
    : Deno.listen({ hostname: host, port })
  console.log(
    'Listening on',
    path ? `Unix socket: ${path}` : `TCP socket: ${host}:${port}`,
  )

  await new ServerHost(pass).listen(listener)
}
