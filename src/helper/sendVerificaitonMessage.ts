import { NextResponse } from "next/server"



export const  sendVerificationMessage =async(mobileNumber:string,username:string,verifycodeOtp:string)=>{
    try {
        const accountSid = process.env.TWILIOACCOUNT_SID!;
        const authToken = process.env.TWILIOACCOUNT_AUTHTOKEN!;
        const client = require('twilio')(accountSid, authToken);
        


        interface TwilioMessage {
            sid: string;
        }

        interface MessageOptions {
            from: string;
            contentSid: string;
            contentVariables: string;
            to: string;
        }

        const otpResponse =  await client.messages
            .create({
            from: 'whatsapp:+14155238886',
            contentSid: process.env.TWILIOACCOUNT_CONTENTSID!,
            contentVariables: ` {"1":"${username} your otp is ${verifycodeOtp}"} `,
            to: `whatsapp:+91${mobileNumber}`
            } as MessageOptions)
            .then((message: TwilioMessage) => console.log(message.sid))
            
            return NextResponse.json({message:"message send successfully",otpResponse,success:true},{status:201})
    } catch (error) {
        
        return NextResponse.json({message:"message is not send",success:false,error},{status:500})
    }
}