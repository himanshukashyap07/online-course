import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/payment";
import User from "@/models/user";
import apiError from "@/utils/apiError";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(req:NextRequest){
    const {userId,courseId} = await req.json()
    await dbConnect()
    try {
        const payment = await Payment.findOne({
            userId:new mongoose.Types.ObjectId(userId),
            courseId: new mongoose.Types.ObjectId(courseId),
            status:"COMPLETED"
        })
    
        if (!payment) {
            return apiError("payment is not compeleted.No payment found")
        }
    
        const user = await User.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $set:{
                    courseBuy:{
                        $cond:{
                            if:{
                                $in:[courseId,"$courseBuy"]
                            },
                            then:"$courseBuy",
                            else:{
                                $concatArrays:["$courseBuy",[courseId]]
                            }
                        }
                    }
                }
            },
            {
                $merge:{
                    into:"users",
                    whenMatched: "merge",
                    whenNotMatched: "discard"
                }
            } 
        ])
    
        if (!user) {
            return apiError("error in adding course details")
        }
        return NextResponse.json({message:"course added successfully",user,success:true},{status:200})
    } catch (error) {
        return apiError("internal server occure in adding course")
    }

}