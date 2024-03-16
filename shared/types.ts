export enum ServerCommands {
  onUnknownMethod,
  getOpponents,
  startAsHost,
  sendMessage,
  endGuest,
}

export enum ClientCommands {
  onUnknownMethod,
  onGotOpponents,
  onStarted,
  onProgress,
  onMessage,
  onWon,
  onEnded,
}

export interface RpcHost {
  handlers: Record<string, CallableFunction>
}
