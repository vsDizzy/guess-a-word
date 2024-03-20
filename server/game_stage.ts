import { SeverConnection } from './server_connection.ts'

export interface GameStage {
  connection: SeverConnection
  handlers: Record<string, (...args: unknown[]) => Promise<void>>
}
