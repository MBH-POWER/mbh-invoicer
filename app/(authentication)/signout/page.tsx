"use client"
import { useAuth } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export default function page() {

    const router = useRouter()
    const { user, logOut } = useAuth()
    logOut()
    router.push('/signin')

    return null
}

