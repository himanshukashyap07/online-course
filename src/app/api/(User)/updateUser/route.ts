import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOption } from "../../(Auth)/auth/[...nextauth]/options";
import apiError from "@/utils/apiError";



export async function GET(){
 const session = await getServerSession(authOption);
    if(!session){
        return apiError("You must be logged in to update user details",401);
    }
    
    console.log(session);
    return NextResponse.json({message:"User is logged in",user:session.user});

}