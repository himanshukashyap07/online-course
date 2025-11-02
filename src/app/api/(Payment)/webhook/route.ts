import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOption } from "../../(Auth)/auth/[...nextauth]/options";
import apiError from "@/utils/apiError";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/payment";
import apiResponse from "@/utils/apirespone";
import { sendEmail } from "@/helper/sendEmail";

export async function POST(req:NextRequest){
    const session  = await getServerSession(authOption);
    if (!session || !session.user) {
        return apiError("Unauthorized", 401);
    }
    try {
        const body = await req.text();
        const signature = req.headers.get("X-Razorpay-Signature");
        if (!signature) {
            return apiError("Missing signature", 400);
        }
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest('hex');
        if (signature !== expectedSignature) {
            return apiError("Invalid signature", 400);
        }
        // Process the webhook payload
        const event = JSON.parse(body);
        await dbConnect();
        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            const orderId = event.payload.payment.entity.order_id;
            const order = await Payment.findOneAndUpdate({orderId},{
                $set:{
                    paymentId:payment.id,
                    status:"COMPLETED"
                }
            }).populate([
                {path:"courseId",select:"title description",options:{strictPopulate:false}},
                {path:"userId",select:"name email",options:{strictPopulate:false}}
            ])

            //send confirmation email to user - todo
            if(!order){
                return apiError("Order not found",404);
            }
            const sendmail = await sendEmail(
                {userEmail: session.user.email!,
                subject: "Payment Successful",
                text: `Dear ${session.user.name!},\n\nYour payment for the course  has been successfully processed.\n\nThank you for your purchase!\n\nBest regards,\nYour Company Name`}
            );
            if (!sendmail) {
                return apiError("email sending failed",500)
            }
            return apiResponse("Payment processed and order updated", 200);
        }

        return apiResponse("order verify successfully",200)
    } catch (error) {
        return apiError("Internal Server Error in verifying the payment", 500);
    }
    
}