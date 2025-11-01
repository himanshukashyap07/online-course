import { authOption } from "@/app/api/(Auth)/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/comment";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req:NextRequest,contex:{params:Promise<{commentId:string}>}){
    const session = await getServerSession(authOption);
    if (!session || !session.user) {
        return apiError("user is not authorized")
    }
    const {commentId} = await contex.params;
    const {content} = await req.json()

    try {
        await dbConnect();
        const comment = await Comment.findByIdAndUpdate({commentId},{
            $set:{
                content
            }
        },{new:true})
        if (!comment) {
            return apiError("comment is not updated")
        }
        return NextResponse.json({message:"comment updated successfully",comment,success:true},{status:200})
    } catch (error) {
        return apiError("internal server error error in updating comment ",500)
    }
}