import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// NOTE: In a real scenario, these would come from process.env
// We will need the user to configure these
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME

// Initialize S3 Client for Cloudflare R2
export const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
})

export interface FileItem {
  key: string
  name: string
  lastModified?: Date
  size?: number
  etag?: string
  isDirectory: boolean
}

export async function listFiles(prefix: string = '') {
  if (!R2_ACCOUNT_ID || !R2_BUCKET_NAME) return []

  // Ensure prefix ends with / if it's a folder and not empty
  const cleanPrefix = prefix && !prefix.endsWith('/') ? prefix + '/' : prefix

  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: cleanPrefix,
      Delimiter: '/',
    })
    
    const data = await R2.send(command)
    
    const files: FileItem[] = (data.Contents || [])
      .filter(item => item.Key !== cleanPrefix) // Remove the folder object itself
      .map(item => ({
        key: item.Key || '',
        name: item.Key?.replace(cleanPrefix, '') || '',
        lastModified: item.LastModified,
        size: item.Size,
        etag: item.ETag,
        isDirectory: false
      }))

    const folders: FileItem[] = (data.CommonPrefixes || []).map(item => ({
      key: item.Prefix || '',
      name: item.Prefix?.replace(cleanPrefix, '').replace('/', '') || '',
      isDirectory: true
    }))

    return [...folders, ...files]
  } catch (error) {
    console.error("Error listing files:", error)
    return []
  }
}

export async function getDownloadUrl(key: string) {
  if (!R2_ACCOUNT_ID || !R2_BUCKET_NAME) return null
  
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
    
    const url = await getSignedUrl(R2, command, { expiresIn: 3600 })
    return url
  } catch (error) {
    console.error("Error generating signed URL:", error)
    return null
  }
}

export async function deleteFile(key: string) {
    if (!R2_ACCOUNT_ID || !R2_BUCKET_NAME) return false

    try {
        const command = new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key
        })
        await R2.send(command)
        return true
    } catch (error) {
        console.error("Error deleting file:", error)
        return false
    }
}

export async function copyFile(sourceKey: string, destinationKey: string) {
    if (!R2_ACCOUNT_ID || !R2_BUCKET_NAME) return false

    try {
        const command = new CopyObjectCommand({
            Bucket: R2_BUCKET_NAME,
            CopySource: `${R2_BUCKET_NAME}/${sourceKey}`,
            Key: destinationKey
        })
        await R2.send(command)
        return true
    } catch (error) {
        console.error("Error copying file:", error)
        return false
    }
}

export async function getFileContent(key: string) {
    if (!R2_ACCOUNT_ID || !R2_BUCKET_NAME) return null

    try {
        const command = new GetObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key
        })
        const response = await R2.send(command)
        if (!response.Body) return null
        return await response.Body.transformToString()
    } catch (error) {
        console.error("Error getting file content:", error)
        return null
    }
}
