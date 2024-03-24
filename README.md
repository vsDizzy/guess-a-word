# Guess a word

Here you can find a client and server for guess a word game.

### Server
- Server slots are hardcoded to 256.
- Server provides a HTTP endpoint showing all the games in realtime.
- Should not crash on client errors.

### Client
- Crashes on every error except when auth with wrong password.

### Protocol

Protocol is very simple, only one-way notifications here.
Commands are one byte and arguments are:
- player id: one byte;
- array of player ids: one byte lenth and then n bytes is the data;
- string: utf-8 bytes ending with 0.

### TODO
- add more tests
- add timeouts
- refactor client exit(1) to graceful exit in case of wrong password
- add more server logs

## Installation

- Install
  [Deno](https://docs.deno.com/runtime/manual/getting_started/installation)
- Clone repo :
  ```bash
  git clone https://github.com/vsDizzy/guess-a-word
  ```
- Change current directory to the cloned folder:
  ```
  cd guess-a-word
  ```
- Start server
  ```bash
  deno task server
  ```
- Start multiple clients
  ```bash
  deno task client
  deno task client
  ...
  deno task client
  ```

### Server usage:

```
deno task server [OTIONS]
```

|Option|Alias|Default|Description|
|-|-|-|-|
|--path|-p||Unix socket path|
|--host|-h|localhost|TCP hostname|
|--port|-p|16384|TCP port|
|--pass||| Server password|
|--apiPort|-a|3000|Server API port|

### Client usage:

```
deno task client [OTIONS]
```

|Option|Alias|Default|Description|
|-|-|-|-|
|--path|-p||Unix socket path|
|--host|-h|localhost|TCP hostname|
|--port|-p|16384|TCP port|
|--pass||| Server password|
