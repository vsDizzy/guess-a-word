export enum ServerMethods {
  listOpponents,
  makeMatch,
}

export interface ServerRequest {
  method: ServerMethods
  args?: unknown[]
}

export enum ServerErrors {
  unknownMethod,
}

export const ServerErrorMessages: { [_: number]: string } = {
  [ServerErrors.unknownMethod]: 'Unknown server method.',
}

export interface ServerResponse {
  result: unknown
  error?: ServerErrors
}

export enum PlayerMethods {
  startHost,
  startPlayer,
  hint,
  endMatch,
}

export interface PlayerRequest {
  method: PlayerMethods
  args?: unknown[]
}
