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
    
        const user = await User.findOne({mobileNumber});
        if (!user) {
            return apiError("user is found",404)
        }
        const currentDate = new Date();
        const validateDate = new Date(user?.verifyCodeExpiry)
        if (currentDate > validateDate) {
            return apiError("code is expire regrenrate password")
        }
    
        if (!(otp === user.verifycode)) {
            return apiError("otp is not correct",401)
        }
    
        const verifiedUser = await User.findByIdAndUpdate({mobileNumber},{
            $set:{
                isVerified:true
            }
        })
        if (!verifiedUser) {
            return apiError("user verification faild")
        }
        return apiResponse("user verification successfully",200)
    } catch (error) {
        return apiError("internal server error in verifing user",500)
    }
}