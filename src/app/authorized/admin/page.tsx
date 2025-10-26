"use client"
import { useSession } from 'next-auth/react'
import React from 'react'

const page = () => {
    const session = useSession()
    if (!session) {
        alert("session is required")
        return <div>user is not authorized</div>
    }

    if (session.data?.user?.role != "admin") {
        return <div>unauthorized request</div>
    }
    const user = session.data?.user
  return (
    <div>
        username:{user.username}, <br />
        fullName:{user.fullname}
      
    </div>
  )
}

export default page

