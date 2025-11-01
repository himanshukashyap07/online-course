import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";
import Video from "@/models/video";
import apiError from "@/utils/apiError";
import { isAdmin } from "@/utils/getAdmin";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    const {url,title,description,courseTitle} = await req.json()
    if (!(await isAdmin())) {
        return apiError("user is unauthorized| this route is for admin")
    }
    if(!url||!title||!description||!courseTitle){
        return apiError("url,title,description and courseTitle is required field")
    }
    await dbConnect()
    try {
        const chcekCourseTitle = courseTitle.toLowerCase()
        const course = await Course.findOne({
            title:chcekCourseTitle
        })
        if (!course) {
            return apiError("course is not found",404)
        }
        const video = await Video.create({
            title,
            description,
            url,
            courseId:course._id
        })
        if (!video) {
            return apiError("video is not created")
        }
        return NextResponse.json({message:"video created successfully",video,success:true},{status:200})
        
    } catch (error) {
        return apiError("internal server error in adding video",500)
    }
}