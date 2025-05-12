import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    try {
        console.log("Received POST request for password update");

        const { userId, password } = await req.json();

        if (!userId || !password) {
            return NextResponse.json({ success: false, message: "Missing user ID or password" }, { status: 400 });
        }

        console.log(`Updating password for user ID: ${userId}`);

        // חיפוש ה-ID של הסיסמה לפי ה-ID של המשתמש
        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: { password: true },
        });

        if (!user || !user.password) {
            return NextResponse.json({ success: false, message: "User not found or no password record exists" }, { status: 400 });
        }

        // הצפנת הסיסמה החדשה
        const hashedPassword = await bcrypt.hash(password, 10);

        // עדכון הסיסמה במסד הנתונים
        await prisma.password.update({
            where: { id: user.password.id_password },
            data: { password: hashedPassword },
        });

        console.log("Password successfully updated");

        return NextResponse.json({ success: true, message: "Password update successful" });
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({ success: false, message: "שגיאה בעדכון הסיסמה" }, { status: 500 });
    }
};
