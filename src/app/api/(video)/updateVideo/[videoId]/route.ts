import Video from "@/models/video";
import apiError from "@/utils/apiError";
import { isAdmin } from "@/utils/getAdmin";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(req:NextRequest,contex:{params:Promise<{videoId:string}>}){
    if (!(await isAdmin())) {
        return apiError("unautharized request| this route is for admin")
    }
    const {videoId} = await contex.params;
    const {title,description} = await req.json();
    try {
        if (!title||!description) {
            return apiError("title and description is required",400)
        }
        const video = await Video.findByIdAndUpdate({videoId},{
            $set:{
                title,
                description
            }
        },{
            new:true
        })

        if (!video) {
            return apiError("video is not update")
        }
        return NextResponse.json({message:"video updated successfully",video,success:true},{status:200})
    } catch (error) {
        return apiError("internal server error occure in updating video",500)
    }
}