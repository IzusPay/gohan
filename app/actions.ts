'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'vps_orders.json')

export async function login(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string || '').trim()
  const password = (formData.get('password') as string || '').trim()

  console.log('Login attempt:', { email, passwordLength: password.length })

  // Simple hardcoded authentication
  if (email === 'pedronovaisengcp@gmail.com' && password === 'Pedila8486') {
    (await cookies()).set('user_role', 'client');
    (await cookies()).set('user_email', email);
    redirect('/dashboard')
  }

  if (email === 'ademir@gmail.com' && password === 'Pedila8486') {
    (await cookies()).set('user_role', 'admin');
    (await cookies()).set('user_email', email);
    redirect('/admin')
  }

  return { error: 'Invalid email or password' }
}

export async function logout() {
  (await cookies()).delete('user_role');
  (await cookies()).delete('user_email');
  redirect('/login')
}

export async function getOrders() {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value
  const email = cookieStore.get('user_email')?.value

  if (!role) return []

  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DB_PATH)
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Ensure file exists
    try {
      await fs.access(DB_PATH)
    } catch {
      await fs.writeFile(DB_PATH, '[]', 'utf-8')
    }

    const data = await fs.readFile(DB_PATH, 'utf-8')
    const orders = JSON.parse(data)

    if (role === 'admin') {
      return orders
    }

    return orders.filter((order: any) => order.userEmail === email)
  } catch (error) {
    console.error('Error reading orders:', error)
    return []
  }
}

export async function createOrder(orderData: any) {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value

  if (role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    const orders = JSON.parse(data)
    
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      ...orderData,
      status: 'Active',
      createdAt: new Date().toISOString()
    }
    
    orders.push(newOrder)
    
    await fs.writeFile(DB_PATH, JSON.stringify(orders, null, 2))
    return { success: true }
  } catch (error) {
    console.error('Error creating order:', error)
    return { error: 'Failed to create order' }
  }
}

export async function upgradeInstance(instanceId: string, newPlan: any) {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value

  if (!role) {
    throw new Error('Unauthorized')
  }

  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    const orders = JSON.parse(data)
    
    const orderIndex = orders.findIndex((o: any) => o.id === instanceId)
    if (orderIndex === -1) {
      return { error: 'Instance not found' }
    }

    // Update the order with new plan details
    orders[orderIndex] = {
      ...orders[orderIndex],
      planName: newPlan.name,
      price: `$${newPlan.price.toFixed(2)}`,
      cpu: newPlan.cpu,
      ram: newPlan.ram,
      storage: newPlan.storage,
      // Keep other fields like id, ip, status, userEmail, createdAt
    }
    
    await fs.writeFile(DB_PATH, JSON.stringify(orders, null, 2))
    return { success: true }
  } catch (error) {
    console.error('Error upgrading instance:', error)
    return { error: 'Failed to upgrade instance' }
  }
}

export async function getUser() {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value
  const email = cookieStore.get('user_email')?.value
  
  return { role, email }
}
