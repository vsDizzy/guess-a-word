import { PlayerMethods, ServerMethods } from '../client/client_connection.ts'

export interface ServerRequest {
  method: ServerMethods
  args?: unknown[]
}

export interface PlayerRequest {
  method: PlayerMethods
  args?: unknown[]
}
