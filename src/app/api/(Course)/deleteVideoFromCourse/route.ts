import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { isAdmin } from "@/utils/getAdmin";
import { NextRequest } from "next/server";


export async function PATCH(req:NextRequest){
    //only admin can delete
    //get courseTitle and videoId 
    // remove videoid from the course videos array
    //video is only removed from course not delete from could
    const {courseTitle,videoId}=await req.json();
    if (!courseTitle||!videoId) {
       return apiError("courseTitle and videoId are required")
    }
    if (!(await isAdmin())) {
        return apiError("unautharized request| this routed is for admin")
    }
    await dbConnect()
    const chcekCourseTitle = courseTitle.toLowerCase()
    try {
        const result = await Course.updateOne({
            title:chcekCourseTitle
        },
        {
            $pull:{
                videos:videoId
            }
        }
        );
        if (!result) {
            return apiError("video is not deleted from course")
        }
        return apiResponse("video removed successfully from the course",200)
    } catch (error) {
        return apiError("internal server error occure in removing video from course")
    }

}