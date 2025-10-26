import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import apiError from "@/utils/apiError";
import { NextResponse } from "next/server";



export async function GET(context:{prams:Promise<{userId:string}>}){
    
    const {userId} = await context.prams;
    await dbConnect()
    const user = User.findById({userId});
    if (!user) {
        return apiError("user not found")
    }

    return NextResponse.json({user,success:true},{status:200})
}