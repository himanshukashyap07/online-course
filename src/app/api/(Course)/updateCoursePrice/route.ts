import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { isAdmin } from "@/utils/getAdmin";
import { NextRequest } from "next/server";


export async function PATCH(req: NextRequest) {
    //check user is admin or not
    //only price can be changed
    if (!(await isAdmin())) {
        return apiError("unautharized request| this route is for admin")
    }
    const { price, cousrseTitle } = await req.json();

    if (!price || !cousrseTitle) {
        return apiError("price and courseTitle are required")
    }
    await dbConnect()
    try {
        const course = await Course.findOneAndUpdate({
            title: cousrseTitle
        },
        {
            set: {
                price
            }
        },
        {
            new: true
        })
        if (!course) {
            return apiError("course price is not updated")
        }
        return apiResponse("course price updated successfully",200)
    } catch (error) {
        return apiError("internal server error in updating price",500)
    }
}