import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import apiError from "@/utils/apiError";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOption } from "../../(Auth)/auth/[...nextauth]/options";



export async function GET(){
    const session = await getServerSession(authOption)
    if (!session || !session.user) {
        return apiError("unautharized user",401)
    }
    const userId = session.user._id;
    await dbConnect()
    const user = User.findById({userId});
    if (!user) {
        return apiError("user not found")
    }

    return NextResponse.json({user,success:true},{status:200})
}