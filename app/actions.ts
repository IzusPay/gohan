'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'vps_orders.json')
const USERS_DB_PATH = path.join(process.cwd(), 'data', 'users.json')

async function getUsersData() {
  try {
    const data = await fs.readFile(USERS_DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array or default users if needed
    // But we just created it, so it should exist.
    return []
  }
}

async function saveUsersData(users: any[]) {
  await fs.writeFile(USERS_DB_PATH, JSON.stringify(users, null, 2))
}

export async function login(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string || '').trim()
  const password = (formData.get('password') as string || '').trim()

  console.log('Login attempt:', { email, passwordLength: password.length })
  console.log('CWD:', process.cwd())
  console.log('Users DB Path:', USERS_DB_PATH)

  try {
    // Check if file exists
    try {
      await fs.access(USERS_DB_PATH)
      console.log('Users file exists')
    } catch (e) {
      console.error('Users file DOES NOT exist at path:', USERS_DB_PATH)
    }

    const users = await getUsersData()
    console.log('Users found (count):', users.length)
    console.log('Users found (emails):', users.map((u: any) => u.email))
    
    const user = users.find((u: any) => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    )

    console.log('User match result:', user ? 'Found' : 'Not Found')
    if (!user) {
        console.log('Password comparison:', { 
            provided: password, 
            stored: users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())?.password 
        })
    }

    if (user) {
      if (user.status === 'inactive') {
        return { error: 'Account is inactive. Please contact support.' }
      }

      (await cookies()).set('user_role', user.role);
      (await cookies()).set('user_email', user.email);
    } else {
        return { error: 'Invalid email or password' }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred' }
  }

  // Perform redirect outside the try-catch block to avoid NEXT_REDIRECT error interception
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value
  
  if (role === 'admin') {
    redirect('/admin')
  } else if (role) {
    redirect('/dashboard')
  }

  return { error: 'Invalid email or password' }
}

export async function registerUserAndOrder(userData: any, orderData: any) {
  try {
    const users = await getUsersData()
    
    // Check if user exists
    let user = users.find((u: any) => u.email === userData.email)
    
    if (!user) {
      // Create new user
      user = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        password: 'ChangeMe123!', // Temporary password or handling logic
        role: 'client',
        status: 'inactive', // Default to inactive
        firstName: userData.firstName,
        lastName: userData.lastName,
        ...userData // Store other details like address, phone
      }
      users.push(user)
      await saveUsersData(users)
    } else {
      // If user exists, maybe update info? For now, just proceed.
      // If user exists and is inactive, they stay inactive.
    }

    // Create Order
    const ordersData = await fs.readFile(DB_PATH, 'utf-8').catch(() => '[]')
    const orders = JSON.parse(ordersData)

    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      ...orderData,
      userEmail: user.email,
      status: 'Active', // Service is active, but user might be inactive
      createdAt: new Date().toISOString()
    }

    orders.push(newOrder)
    await fs.writeFile(DB_PATH, JSON.stringify(orders, null, 2))

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'Failed to process order' }
  }
}

export async function getAllUsers() {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value
  
  if (role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return await getUsersData()
}

export async function updateUserStatus(userId: string, status: string) {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value
  
  if (role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const users = await getUsersData()
  const userIndex = users.findIndex((u: any) => u.id === userId)
  
  if (userIndex !== -1) {
    users[userIndex].status = status
    await saveUsersData(users)
    return { success: true }
  }
  
  return { error: 'User not found' }
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

export async function getInstanceBySubdomain(subdomain: string) {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    const orders = JSON.parse(data)
    return orders.find((o: any) => o.subdomain === subdomain)
  } catch (error) {
    console.error('Error finding instance by subdomain:', error)
    return null
  }
}
