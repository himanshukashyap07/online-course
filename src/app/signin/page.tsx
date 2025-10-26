"use client"
import hideRouteForVerifyUserRoute from '@/utils/verifyUserRoute'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const router = useRouter()
    //authorized user can't see this route
    const isUserAuthorized = hideRouteForVerifyUserRoute()
    useEffect(() => {
        if (isUserAuthorized) {
            router.replace("/")
        }
    }, [isUserAuthorized])

    const handlesignin = async (e: any) => {
        e.preventDefault();
        if (!username) {
            alert("enter username")
            return
        }
        if (!password) {
            alert("enter password")
            return
        }

        try {
            const result = await signIn("credentials", {
                redirect: false,
                identifier: username,
                password,
            });
            console.log(result);

            if (result?.ok) {
                router.replace("/")
                setUsername("");
                setPassword("");
            } else {
                console.log("Sign-in failed", result);
            }
        } catch (error) {
            console.error("Sign-in error", error);
        }
    };



    return (
        <div>
            <form>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} name="identifier" id="identifier" placeholder='Email /username / mobileNumber' />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} name="password" id="password" placeholder='enter your password' />
                <button type='submit' className='bg-blue-500 hover:bg-blue-300' onClick={handlesignin}>submit</button>
            </form>
        </div>
    )
}

export default page
