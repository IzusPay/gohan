'use server'

import { listFiles, getDownloadUrl, deleteFile, copyFile, getFileContent, R2 } from "@/lib/storage"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { revalidatePath } from "next/cache"
import fs from 'fs/promises'
import path from 'path'

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME

export const runtime = 'edge'

async function getInstanceRoot(instanceId: string) {
  try {
    const DB_PATH = path.join(process.cwd(), 'data', 'vps_orders.json')
    const data = await fs.readFile(DB_PATH, 'utf-8')
    const orders = JSON.parse(data)
    const order = orders.find((o: any) => o.id === instanceId)
    
    if (!order || order.type !== 'hosting') return null
    return `websites/${order.subdomain}/public_html/`
  } catch (error) {
    console.error('Error getting instance root:', error)
    return null
  }
}

export async function getFiles(instanceId?: string, relativePath: string = '') {
  let prefix = relativePath
  
  if (instanceId) {
    const root = await getInstanceRoot(instanceId)
    if (!root) return [] // Access denied or invalid instance
    
    // Ensure relativePath doesn't try to go up
    if (relativePath.includes('..')) return []
    
    prefix = root + relativePath
    // Remove double slashes if any
    prefix = prefix.replace(/\/+/g, '/')
  }

  const files = await listFiles(prefix)
  
  // If we are in instance mode, strip the root prefix from keys for display
  if (instanceId) {
    const root = await getInstanceRoot(instanceId)
    if (root) {
      return files.map(f => ({
        ...f,
        // The key needs to be stripped of the root prefix for display, but kept full for operations?
        // Actually, let's return the full key for operations, but maybe add a 'displayPath'
        displayPath: f.key.replace(root, ''),
        name: f.name // Name is already relative to the listed prefix
      }))
    }
  }
  
  return files
}

export async function getFileUrl(key: string) {
  return await getDownloadUrl(key)
}

export async function removeFile(key: string, pathForRevalidation: string = '/dashboard/storage') {
  const success = await deleteFile(key)
  if (success) {
    revalidatePath(pathForRevalidation)
  }
  return success
}

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File
    const instanceId = formData.get('instanceId') as string
    const currentPath = formData.get('currentPath') as string || ''
    
    if (!file) return { error: 'No file provided' }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    let key = file.name
    
    if (instanceId) {
      const root = await getInstanceRoot(instanceId)
      if (!root) return { error: 'Invalid instance' }
      key = `${root}${currentPath}${file.name}`.replace(/\/+/g, '/')
    } else if (currentPath) {
        key = `${currentPath}${file.name}`.replace(/\/+/g, '/')
    }

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })

    await R2.send(command)
    revalidatePath('/dashboard/storage')
    return { success: true }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: 'Failed to upload file' }
  }
}

export async function createFolder(instanceId: string, currentPath: string, folderName: string) {
    try {
        const root = await getInstanceRoot(instanceId)
        if (!root) return { error: 'Invalid instance' }
        
        const key = `${root}${currentPath}${folderName}/`.replace(/\/+/g, '/')
        
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: Buffer.from(''),
        })
        
        await R2.send(command)
        return { success: true }
    } catch (error) {
        console.error('Create folder error:', error)
        return { error: 'Failed to create folder' }
    }
}

export async function renameFileAction(oldKey: string, newName: string) {
    try {
        // Construct new key based on old key's directory
        const pathParts = oldKey.split('/')
        pathParts.pop() // Remove filename
        const newKey = [...pathParts, newName].join('/')
        
        // Copy
        const copySuccess = await copyFile(oldKey, newKey)
        if (!copySuccess) return { error: 'Failed to copy file' }
        
        // Delete old
        const deleteSuccess = await deleteFile(oldKey)
        if (!deleteSuccess) return { error: 'Failed to delete old file' }
        
        return { success: true }
    } catch (error) {
        console.error('Rename error:', error)
        return { error: 'Failed to rename file' }
    }
}

export async function saveFileContentAction(key: string, content: string) {
    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: Buffer.from(content),
            ContentType: 'text/plain', // Or guess based on extension
        })
        
        await R2.send(command)
        return { success: true }
    } catch (error) {
        console.error('Save file error:', error)
        return { error: 'Failed to save file' }
    }
}

export async function fetchFileContentAction(key: string) {
    return await getFileContent(key)
}

export async function fetchFileContentBase64Action(key: string) {
    try {
        const url = await getDownloadUrl(key)
        if (!url) return null
        
        const response = await fetch(url)
        if (!response.ok) return null
        
        const arrayBuffer = await response.arrayBuffer()
        return Buffer.from(arrayBuffer).toString('base64')
    } catch (error) {
        console.error('Fetch base64 error:', error)
        return null
    }
}

export async function moveFileAction(oldKey: string, newPath: string) {
    try {
        // newPath should be the full destination key (including filename)
        
        // Copy
        const copySuccess = await copyFile(oldKey, newPath)
        if (!copySuccess) return { error: 'Failed to copy file' }
        
        // Delete old
        const deleteSuccess = await deleteFile(oldKey)
        if (!deleteSuccess) return { error: 'Failed to delete old file' }
        
        return { success: true }
    } catch (error) {
        console.error('Move error:', error)
        return { error: 'Failed to move file' }
    }
}

export async function getUploadUrlAction(instanceId: string, currentPath: string, filename: string, contentType: string) {
    try {
        const root = await getInstanceRoot(instanceId)
        if (!root) return { error: 'Invalid instance' }
        
        const key = `${root}${currentPath}${filename}`.replace(/\/+/g, '/')
        
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        })
        
        const url = await getSignedUrl(R2, command, { expiresIn: 3600 })
        
        return { success: true, url, key }
    } catch (error) {
        console.error('Error generating presigned URL:', error)
        return { error: 'Failed to generate upload URL' }
    }
}

