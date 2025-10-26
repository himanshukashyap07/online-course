"use client"
import hideRouteForVerifyUserRoute from '@/utils/verifyUserRoute'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
//real signinpage 
// when user click on signup and the process of signup is complete then the checkOtp will true and otp check code is run 
const page = () => {
    const [otp, setOtp] = useState("")
    const [checkOtp, setCheckOtp] = useState(true)
    const router = useRouter();
    const otpSecret = process.env.NEXT_PUBLIC_OTPSECRET
    if (!otpSecret) {
        alert("secret is not get")
    }
    //authorized user can't see this route
    const isUserAuthorized = hideRouteForVerifyUserRoute()   
    useEffect(()=>{
        if (isUserAuthorized) {
            router.replace("/")
        }
    },[isUserAuthorized])


    const handelSignUp = async()=>{
        //todo signup logic

        // if all word is compeleted successfully
        setCheckOtp(true)
    }
    const handleVerifyOtp = async () => {
        try {
            const res = await axios.patch("/api/verifyOtp", {
                otp,
                mobileNumber: 8700461551,
                otpSecret
            })
            if (!res) {
                alert("user is not verified")
                console.log(res);

            }
            alert("user verified successfully")
            router.replace("/")
        } catch (error) {
            console.log(error);

            alert("error occure in verify user")
        }
    }
    return (
        <>
            {
                checkOtp ? (
                    <div>
                        <input type="text" onChange={(e) => setOtp(e.target.value)} value={otp} name="otp" placeholder='enter otp' />
                        <button type="submit" className="bg-blue-700 hover:bg-blue-500" onClick={handleVerifyOtp}>verify otp</button>
                    </div>
                ) : (
                    <div>
                        //signup logic
                    </div>
                )
            }
        </>
    )
}

export default page
