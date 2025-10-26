import { NextRequest } from "next/server";



export async function PATCH(req:NextRequest){
    const {oldPassword,newPasword} = await req.json()
}