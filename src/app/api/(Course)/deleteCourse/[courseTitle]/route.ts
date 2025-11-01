import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { isAdmin } from "@/utils/getAdmin";


export async function DELETE(conext:{params:Promise<{courseTitle:string}>}){
    const {courseTitle } = await conext.params;
    if (!(await isAdmin())) {
        return apiError("This route is only for admin| unautharized request")
    }
    if (!courseTitle) {
       return apiError("courseTitle is required")
    }
    await dbConnect()
    try {
        const courseDelete = await Course.findOneAndDelete({
            title:courseTitle
        })
        if (!courseDelete) {
            return apiError("course is not deleted")
        }
    
        return apiResponse("Course added successfully",200)
    } catch (error) {
        return apiError("internal server error in deleting course")
    }

}