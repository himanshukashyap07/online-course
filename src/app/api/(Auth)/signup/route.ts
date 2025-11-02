import { sendVerificationMessage } from "@/helper/sendVerificaitonMessage";
import User from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    const { username, email, password, mobileNumber, fullname, avatar } = await req.json()
    // if ([username, email, password, mobileNumber, fullname, avatar].some((fields) => fields?.trim() === "")) {
    //     return NextResponse.json({ message: "all fields are require", success: false }, { status: 400 })
    // }
    if (!email.includes("@")) {
        return apiError("email is not in correct formate")
    }
    try {
        await dbConnect()

        const existingUser = await User.findOne({
            $or: [
                { username },
                { email },
                { mobileNumber }
            ]
        })

        const verifycodeOtp = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUser) {
            if (existingUser.isVerified) {
                return apiError("user is allready verified")
            }
        } else {
            const expiryDate = new Date()
            expiryDate.setMinutes(expiryDate.getMinutes() + 20)
            const isAdmin = (email === process.env.ADMIN_EMAIL)
            if (isAdmin) {
                await User.create({
                    username,
                    email,
                    mobileNumber,
                    fullname,
                    avatar,
                    password,
                    isVerified: true,
                })
                return apiResponse("user created successfully",200)
            }
            await User.create({
                username,
                email,
                mobileNumber,
                fullname,
                avatar,
                password,
                verifycode: verifycodeOtp,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
            })
            //message otp varification
            const messageResponse = await sendVerificationMessage(
                mobileNumber,
                username,
                verifycodeOtp
            )
            const responseData = await messageResponse.json();
            if (!responseData.success) {
                return apiError(responseData.message,500)
                
            }
            return apiResponse("user created successfully verifyUser",200)
        }


        // return apiResponse("user registered successfully",200)
    } catch (error) {
        console.log(error);
        
        return apiError("interal server error occur in signup",500)
    }
}