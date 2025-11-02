import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { authOption } from "../../(Auth)/auth/[...nextauth]/options";
import apiError from "@/utils/apiError";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/payment";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export async function POST(req:NextRequest){
    const session  = await getServerSession(authOption);
    if (!session || !session.user) {
        return apiError("Unauthorized request", 401);
    }
    try {
        const {courseId, amount} = await req.json();
        if(!courseId || !amount){
            return apiError("Invalid Data", 400);
        }
        await dbConnect();
        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
            notes:{
                courseId: courseId.toString(),
                userId: session.user._id.toString(),
            }
        });

        const newOrder = await Payment.create({
            userId: session.user._id,
            courseId,
            orderId: order.id,
            currency: "INR",
            price: amount * 100,
            status: "pending",
        })

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            paymentDbId: newOrder._id
        },{status:201});
        
    } catch (error) {
        return apiError("Internal Server Error in creating order", 500);
    }
} 