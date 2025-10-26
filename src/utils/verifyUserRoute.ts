import { useSession } from "next-auth/react";


export default function hideRouteForVerifyUserRoute(){
    const {status} = useSession()
    if (status==="authenticated") {
        return true
    }
    return false
}