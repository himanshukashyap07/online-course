import { authOption } from "@/app/api/(Auth)/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function isAutharizedUser(){
    const session = await getServerSession(authOption)
    if (!session || !session.user) {
        return false
    }
    if (session.user.role !== "user") {
        return false
    }
    return true
}