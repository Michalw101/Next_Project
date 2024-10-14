import prisma from "../../../prisma/client";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const body = await request.json();

        const user = await prisma.Users.create({
            data: body
        })

        return NextResponse.json({ message: "success post user", success: true, user });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "failed post user", success: false });
    }
}