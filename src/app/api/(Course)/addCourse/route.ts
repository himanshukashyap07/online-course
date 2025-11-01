
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOption } from "../../(Auth)/auth/[...nextauth]/options";
import apiError from "@/utils/apiError";
import Course from "@/models/course";
import dbConnect from "@/lib/dbConnect";
import { isAdmin } from "@/utils/getAdmin";

export async function POST(req:NextRequest){
    //add thumbnail by upload file and then send here;
    //algo
    // get data from the admin and check all data are getting
    // only admin can add the course
    // const session = await getServerSession(authOption)
    if (!(await isAdmin())) {
        return apiError("unautharized request| this route is for admin")
    }
    await dbConnect()
    try {
        const {title,description,price,thumbnail} = await req.json()
        if (!title || !description || !price || !thumbnail) {
            return apiError("all credential are required")
        }
    
        const course = await Course.create({
            title:title.toLowerCase(),
            description,
            price,
            thumbnail
        },{new:true})
    
        if (!course) {
            return apiError("course is not created")
        }
        return NextResponse.json({message:"course is created successfully",success:true},{status:200})
    } catch (error) {
        return apiError("internal server error occure in the creating course")
    }

}