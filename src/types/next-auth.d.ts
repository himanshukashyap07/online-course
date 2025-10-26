import 'next-auth';
import { DefaultSession } from 'next-auth';
declare module 'next-auth' {
    interface User{
        _id?:string;
        isVerified?:boolean;
        username?:string;
        fullname?:string;
        avatar?:string;
        mobileNumber?:string;
        role?:string;
    }
    interface Session{
        user:{
            _id?:string;
            isVerified?:boolean;
            username?:string;
            fullname?:string;
            avatar?:string;
            mobileNumber?:string;
            role?:string;
        } & DefauiltSession['user']
    }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    isVerified: boolean;
    username: string;
    fullname: string;
    avatar?: string;
    mobileNumber?: string;
    email: string;
    role:string
  }
}