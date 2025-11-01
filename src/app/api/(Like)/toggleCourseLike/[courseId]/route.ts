import { authOption } from "@/app/api/(Auth)/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Like from "@/models/like";
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
    const userId = session.user._id;

    try {
        await dbConnect();
        const isCourseLiked = await Like.findOne({
            likedBy:userId,
            course:courseId
        })
        if (isCourseLiked) {
            const likeId = isCourseLiked._id
            await Like.findByIdAndDelete({likeId})
            return apiResponse("like removed",200)
        }
        await Like.create({
            likedBy:userId,
            course:courseId
        })
        return apiResponse("like created",200)

    } catch (error) {
        return apiError("internal server error in toggling like on course",500)
    }
}