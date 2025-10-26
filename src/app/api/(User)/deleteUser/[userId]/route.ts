import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { NextRequest } from "next/server";



export async function DELETE(req:NextRequest,context:{params:Promise<{userId:string}>}){
    const {userId} = await context.params;
    await dbConnect()

    try {
        const user = await User.findById({userId})
    
        if (!user || !user.isVerified) {
            return apiError("user is not found")
        }
    
        await User.findByIdAndDelete({userId})
        return apiResponse("user deleted successfully",200)
    } catch (error) {
        return apiError("internal server error in deleting user")
    }

}