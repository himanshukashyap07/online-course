import { authOption } from "@/app/api/(Auth)/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/comment";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function DELETE(
    req: NextRequest,
    context:{params:Promise<{commentId:string}>}
) {
    const { commentId } = await context.params;
    const session = await getServerSession(authOption);
    if (!session || !session.user) {
        return apiError("user is not authorized")
    }

    try {
        await dbConnect();
        const comment = await Comment.findByIdAndDelete(commentId)
        if (!comment) {
            return apiError("comment is not deleted")
        }
        return apiResponse("comment deleted successfully",200)
    } catch (error) {
        return apiError("internal server error error in deleting comment ",500)
    }
}