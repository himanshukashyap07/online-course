import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { isAdmin } from "@/utils/getAdmin";
import { NextRequest } from "next/server";


export async function PATCH(req: NextRequest) {
    //check user is admin or not
    //only description can be changed
    if (!(await isAdmin())) {
        return apiError("unautharized request| this route is for admin")
    }
    const { description, cousrseTitle } = await req.json();

    if (!description || !cousrseTitle) {
        return apiError("description and courseTitle are required")
    }
    await dbConnect()
    try {
        const course = await Course.findOneAndUpdate({
            title: cousrseTitle
        },
        {
            set: {
                description
            }
        },
        {
            new: true
        })
        if (!course) {
            return apiError("course description is not updated")
        }
        return apiResponse("course description updated successfully",200)
    } catch (error) {
        return apiError("internal server error in updating descripiton",500)
    }
}