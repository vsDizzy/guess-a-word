const inputStream = Deno.stdin.readable.pipeThrough(new TextDecoderStream())

export async function readLine() {
  const { value } = await inputStream.values({ preventCancel: true }).next()
  return value.replace(/\r?\n$/, '')
}
