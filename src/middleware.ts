import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(){
        return NextResponse.next();
    },
    {
        callbacks:{
            authorized:({token,req}:any)=>{
                const {pathname} = req.nextUrl;
                // allow webhook endpoint
                if (pathname.startsWith("/api/webhook")) {
                    return true
                }
                // allow auth related paths
                if (pathname.startsWith("/signin") || pathname.startsWith("/signup") || pathname.startsWith("/api/upload-auth") || pathname.startsWith("/api/auth/")|| pathname.startsWith("/api/signup")) {
                    return true
                }
                //just for testing
                if (pathname.startsWith("/validateOtp") || pathname.startsWith("/api/verifyOtp")) {
                    return true
                }
                
                //public routes
                if (pathname.startsWith("/courses") || pathname.startsWith("/course/") ) {
                    return true
                } 

                //admin routes
                if (pathname.startsWith("/authorized/admin")) {
                    return token?.role === "admin"
                }
                // all other routes are need authentication
                return !!token;
            }
        }
    }
)
export  const config = {
    matcher: [
        "/((?!api/auth|_next|favicon.ico).*)",
    ]
}
