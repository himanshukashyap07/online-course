"use client"
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
export default function Home() {
  const session = useSession()
  console.log(session.data?.user);

  
  return (
   <div>
    <Image src={session.data?.user?.avatar} alt="logo" width={200} height={200} />
    userEmail :{session.data?.user?.email} <br />
    username :{session.data?.user?.username} <br />
    fullname :{session.data?.user?.fullname} <br />
    mobileNumber :{session.data?.user?.mobileNumber} <br />
    <button type="submit" className="bg-blue-800" onClick={()=>signOut()}>signOut</button>
   </div>
  )
}
