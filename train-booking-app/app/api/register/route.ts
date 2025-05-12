import prisma from "../../../prisma/client";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';


export async function POST(request:Request) {
    try {
        const body = await request.json();
        console.log("body", body);
        
        // הצפנת הסיסמה
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // יצירת משתמש עם סיסמה מוצפנת, ללא טלפון
        const user = await prisma.users.create({
            data: {
                name: body.name,
                email: body.email,
                password: {
                    create: {
                        password: hashedPassword,
                    },
                },
            },
        });
   
        return NextResponse.json({ message: "success post user", success: true, user });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "failed post user", success: false });
    }
}