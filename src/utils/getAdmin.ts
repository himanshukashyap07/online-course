import { authOption } from "@/app/api/(Auth)/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function isAdmin(){
    const session = await getServerSession(authOption)
    if (!session) {
        return false
    }
    if (session.user.role !== "admin") {
        return false
    }
    return true
}