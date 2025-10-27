import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOption } from "../../(Auth)/auth/[...nextauth]/options";




export async function PATCH(req:NextRequest){

    // in frontend the file is send to the imagekit and the previos image is deleted after updating the user avatar
    //the url come from the imagekit by submit the new avatar
    const {url} = await req.json()
    if (!url) {
        return apiError("url is required",404)
    }
    await dbConnect()
    try {
        const session = await getServerSession(authOption)
        if (!session) {
            return apiError("user is not authorized")
        }
        const userId = session.user._id
        const updatedUser = await User.findByIdAndUpdate({userId},{
            $set:{
                avatar:url
            }
        },{new:true})

        return NextResponse.json({message:"avatar updated successfully",updatedUser,success:true},{status:200})
    } catch (error) {
        return apiError("Internal server error in updating avatar")
    }   

}