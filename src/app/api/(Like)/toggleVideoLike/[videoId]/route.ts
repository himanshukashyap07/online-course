import { authOption } from "@/app/api/(Auth)/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Like from "@/models/like";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest,contex:{params:Promise<{videoId:string}>}){
    const session = await getServerSession(authOption);
    if (!session || !session.user) {
        return apiError("user is not authorized")
    }
    const {videoId} = await contex.params;
    const userId = session.user._id;

    try {
        await dbConnect();
        const isVideoLiked = await Like.findOne({
            likedBy:userId,
            video:videoId
        })
        if (isVideoLiked) {
            const likeId = isVideoLiked._id
            await Like.findByIdAndDelete({likeId})
            return apiResponse("like removed",200)
        }
        await Like.create({
            likedBy:userId,
            video:videoId
        })
        return apiResponse("like created",200)

    } catch (error) {
        return apiError("internal server error in toggling like on video",500)
    }
}