'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function selectRole(role: 'student' | 'teacher') {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('User not found')
  }

  const client = await clerkClient()

  // Update the user's metadata with the chosen role
  await client.users.updateUser(userId, {
    publicMetadata: {
      role: role,
      onboardingComplete: true
    }
  })

  // Redirect to the correct dashboard
  if (role === 'teacher') {
    redirect('/teacher-dashboard')
  } else {
    redirect('/student-dashboard') // You'll handle the ID logic later
  }
}