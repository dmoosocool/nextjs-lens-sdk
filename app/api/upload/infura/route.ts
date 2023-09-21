import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import os from 'os'
import path from 'path'

const apiKey = process.env.INFURA_API_KEY
const apiKeySecret = process.env.INFURA_API_KEY_SECRET
export async function POST(req: NextRequest) {
  const data = await req.json()
  if(!apiKey || !apiKeySecret) {
    throw new Error('Missing INFURA_PROJECT_ID or INFURA_SECRET in the .env file')
  }

  const random = Math.random().toString(36).substring(7)
  const filename = new Date().getTime() + random + '.json'
  const pathname = path.join(os.tmpdir(), filename)

  await fs.promises.writeFile(pathname, JSON.stringify(data))
  const fileStream = await fs.promises.readFile(pathname)

  const formData = new FormData()
  formData.append('file', new Blob([fileStream]))

  const resp = await fetch(`https://ipfs.infura.io:5001/api/v0/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiKeySecret}`, 'utf-8').toString('base64')}`
    },
    body: formData
  })
  const result = await resp.json()

  console.log(result)
  return NextResponse.json(result)
}
