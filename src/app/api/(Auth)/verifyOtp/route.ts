import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req:NextRequest){
    await dbConnect()
    const {otp,mobileNumber,otpSecret} = await req.json()
    try {
        if (!otp || !mobileNumber) {
            return apiError("otp and mobile number is required");
        }
        if (otpSecret !== process.env.NEXT_PUBLIC_OTPSECRET) {
            return apiError("unauthorized request")
        }
    
        const mobile = Number(mobileNumber)
        const user = await User.findOne({ mobileNumber: mobile });
        if (!user) {
            return apiError("user not found",404)
        }
        const currentDate = new Date();
        if (!user.verifyCodeExpiry) {
            return apiError("no expiry found for verification code",400)
        }
        const validateDate = new Date(user.verifyCodeExpiry)
        if (isNaN(validateDate.getTime()) || currentDate > validateDate) {
            return apiError("code is expired, re-generate please",400)
        }

        if (String(otp) !== String(user.verifycode)) {
            return apiError("otp is not correct",401)
        }
    
        const verifiedUser = await User.findOneAndUpdate({ mobileNumber: mobile }, {
            $set: { isVerified: true }
        }, { new: true })
        if (!verifiedUser) {
            return apiError("user verification faild")
        }
        return apiResponse("user verification successfully",200)
    } catch (error) {
        console.error("verifyOtp error:", error)
        return apiError("internal server error in verifing user",500)
    }
}