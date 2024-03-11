# Guess a word

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

| Option     | Description      |
| ---------- | ---------------- |
| --path, -p | Unix socket path |
| --host, -h | TCP hostname     |
| --port, -p | TCP port         |
| --pass     | Server password  |

### Client usage:

```
deno task client [OTIONS]
```

| Option     | Description      |
| ---------- | ---------------- |
| --path, -p | Unix socket path |
| --host, -h | TCP hostname     |
| --port, -p | TCP port         |
| --pass     | Server password  |
