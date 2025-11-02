import { getServerSession } from "next-auth";
import {NextResponse } from "next/server";
import { authOption } from "../../(Auth)/auth/[...nextauth]/options";
import apiError from "@/utils/apiError";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/payment";



export async function GET(){
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) {
            return apiError("Unauthorized", 401);
        }
        await dbConnect();
        const orders = await Payment.find({ userId: session.user._id })
        .populate({
            path: "courseId",
            select: "title description",
            options: { strictPopulate: false }
        })
        .sort({ createdAt: -1 }).lean();
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return apiError("Internal Server Error in getting orders", 500);
    }
}