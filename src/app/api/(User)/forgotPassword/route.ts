import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOption } from "../../(Auth)/auth/[...nextauth]/options";
import bcrypt from "bcryptjs";



export async function PATCH(req: NextRequest) {
    const { oldPassword, newPasword } = await req.json()
    const sesssion = await getServerSession(authOption)
    try {

        if (!oldPassword || !newPasword) {
            return apiError("password and email is required")
        }
        if (!sesssion) {
            return apiError("You must be logged in to update password", 401)
        }
        await dbConnect()
        const email = sesssion.user?.email as string;
        const user = sesssion.user as any;
        const ispasswordCorrect = bcrypt.compare(oldPassword, user.password);
        if (!ispasswordCorrect) {
            return apiError("old password is incorrect", 400)
        }

        const updatedUser = await User.findOneAndUpdate({ email }, {
            $set: {
                password: newPasword
            }
        }, {
            new: true
        })
        if (!updatedUser) {
            return apiError("user not found", 404)
        }

        return apiResponse("user password updated successfully", 200)

    } catch (error) {
        return apiError("internal server error in updating password")
    }
}