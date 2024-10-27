import prisma from "../../../prisma/client";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("body", body);

        // const service = await prisma.Services.create({
        //     data: body
        // })

        // return NextResponse.json({ message: "success post user", success: true, service });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "failed post user", success: false });
    }
}