
import { listFiles, getFileContent } from './lib/storage'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars from .env.local
dotenv.config({ path: '.env.local' })

async function checkR2() {
  console.log('Checking R2 connection...')
  console.log('Bucket:', process.env.R2_BUCKET_NAME)
  
  try {
    const files = await listFiles('data/')
    console.log('Files in data/ folder on R2:', files.map(f => f.name))
    
    const usersContent = await getFileContent('data/users.json')
    if (usersContent) {
      console.log('Found users.json in R2. Size:', usersContent.length)
      console.log('Content preview:', usersContent.substring(0, 100))
    } else {
      console.log('users.json NOT found in R2.')
    }
  } catch (error) {
    console.error('Error connecting to R2:', error)
  }
}

checkR2()
