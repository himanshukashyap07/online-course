import Course from "@/models/course";
import Video from "@/models/video";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { isAdmin } from "@/utils/getAdmin";
import { NextRequest } from "next/server";

export async function DELETE(req:NextRequest,context:{params:Promise<{videoId:string}>}){
    const {videoId} = await context.params;
    if (!(await isAdmin())) {
        return apiError("unautharized request| this route is for admin")
    }
    try {
        const video = await Video.findById({videoId})
        if (!video) {
            return apiError("video not found",404)
        }
        // removing video from course
        const courseId = video.courseId;
        await Course.updateOne({
            courseId
        },{
            $pull:{
                videos:videoId
            }
        });

        //todo delete video from imagekit
        
        const deleteVideo = await Video.findByIdAndDelete({videoId})
        if (!deleteVideo) {
            return apiError("video is not deleted",401)
        }
        return apiResponse("video deleted successfully",200)
    } catch (error) {
        return apiError("internal server error in deleting video",500)
    }
}