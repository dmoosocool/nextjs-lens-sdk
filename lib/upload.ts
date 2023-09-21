
export async function upload(data: unknown): Promise<string> {
  const resp = await fetch(`/api/upload/infura`,{
    method:'POST',
    body: JSON.stringify(data as Record<string, any>),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const result = await resp.json() as {Name: string, Hash: string, Size: string}
  return `ipfs://${result.Hash}`
}
