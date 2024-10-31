import prisma from "../../../prisma/client";
import { NextResponse } from "next/server";


export async function POST(request:Request) {
    try {
        const body = await request.json();

       const user = await prisma.users.create({
            data:body
        })
 
        return NextResponse.json({message:"success register user",success:true , user });
    } catch (error) {
        console.log(error);
       return NextResponse.json({message:"not success register user",success:false});
    }
}