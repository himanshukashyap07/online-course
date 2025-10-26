import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/payment";
import User from "@/models/user";
import apiError from "@/utils/apiError";
import mongoose from "mongoose";
import { NextRequest } from "next/server";



export async function PATCH(req:NextRequest){
    const {userId,courseId} = await req.json()
    await dbConnect()
    const payment = await Payment.findOne({
        userId:new mongoose.Types.ObjectId(userId),
        courseId: new mongoose.Types.ObjectId(courseId),
        status:"COMPLETED"
    })

    if (!payment) {
        return apiError("payment is not compeleted.No payment found")
    }

    await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(userId)
            }
        },
        
    ])

}