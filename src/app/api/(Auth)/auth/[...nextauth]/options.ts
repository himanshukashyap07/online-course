import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";  
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import apiError from "@/utils/apiError";



export const authOption:NextAuthOptions={
       providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                identifier:{label:"Enter username , email or mobileNumber",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials:any):Promise<any>{
                if (!credentials) {
                    return apiError("credentials are required")
                }
                await dbConnect(); 
                try {
                    const user = await User.findOne(
                        {
                            $or:[
                                {email:credentials.identifier},
                                {username:credentials.identifier},
                                {mobileNumber:Number(credentials.identifier)}
                            ]
                        }
                    )

                    if(!user){
                        return apiError("user is not found",404)
                    }
                    if (!user.isVerified) {
                        return apiError("user is not verified",401)
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
                    if (isPasswordCorrect) {
                        return user 
                    }else{
                        return apiError("password is not correct")
                    }
                } catch (error) {
                    return apiError("internal server occuer in signin user",500)
                }
            }
        })
       ],
       callbacks:{
           async jwt({ token, user }) {
            // give data to token form user
               if (user) {
                   token._id = user._id?.toString() ||"" // user will not give us data esily so we created a file in types folder next-auth.d.ts
                   token.isVerified = user.isVerified ||false
                   token.username = user.username||""
                   token.fullname = user.fullname||""
                   token.email = user.email||"";
                   token.avatar=user.avatar||"";
                   token.role = user.role||"";
                   token.mobileNumber=user.mobileNumber
               }
               return token
           },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.username = token.username
                session.user.fullname = token.fullname
                session.user.email = token.email
                session.user.avatar = token.avatar
                session.user.role = token.role
                session.user.mobileNumber = token.mobileNumber
            }
            return session
        },
       },
       // sign in route is automatically created by next-auth and handel by next-auth we doesn't need to create it or worry about it
       
       pages:{
        signIn:"/signin",
        error:"/signin"
        },
       session:{
        strategy:"jwt",
       },
       // secret key is used to encrypt the jwt token !very important and highly sensitive key
       secret:process.env.NEXTAUTH_SECRET
       
}














