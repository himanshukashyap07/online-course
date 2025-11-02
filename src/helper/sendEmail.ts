import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apirespone";
import nodemailer from "nodemailer";

type email={
    userEmail:string,
    subject:string,
    text:string
}
export async function sendEmail({userEmail,subject,text}:email){
    const transporter = nodemailer.createTransport({
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!
        }
    });
    const mail = await transporter.sendMail({
        from:process.env.SMTP_USER!,
        to:userEmail,
        subject,
        text
    })
    if (!mail) {
        return apiError("Email is not send")
    }
    return apiResponse("Email send successfully")

}
