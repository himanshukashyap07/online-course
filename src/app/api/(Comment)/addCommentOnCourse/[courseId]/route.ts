import { authOption } from "@/app/api/(Auth)/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/comment";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest,contex:{params:Promise<{courseId:string}>}){
    const session = await getServerSession(authOption);
    if (!session || !session.user) {
        return apiError("user is not authorized")
    }
    const {courseId} = await contex.params;
    const {content} = await req.json()
    const userId = session.user._id;

    try {
        await dbConnect();
        const comment = await Comment.create({
            content,
            course:courseId,
            owner:userId
        })
        if (!comment) {
            return apiError("comment is not created")
        }
        return apiResponse("comment created successfully",200)
    } catch (error) {
        return apiError("internal server error error in creating comment on course",500)
    }
}