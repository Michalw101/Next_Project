import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// פונקציה לשלוח דוא"ל לשחזור סיסמא
const sendResetPasswordEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // האימייל שלך
            pass: process.env.EMAIL_PASS, // הסיסמא לאימייל שלך או גישה לאפליקציה
        },
        tls: {
            rejectUnauthorized: false, // מאפשר להתעלם מתעודות לא חתומות
        },
    });

    const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "בקשה לשחזור סיסמא",
        html: `
        <p>שלום,</p>
        <p>לחץ על הקישור הבא כדי לשחזר את הסיסמא שלך:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>בברכה,<br>צוות התמיכה</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        // בדיקת תקינות הדוא"ל במסד נתונים (לדוגמה בלבד)
        const user = { email: "example@example.com" }; // יש להחליף בבדיקת מסד נתונים אמיתית

        if (user) {
            const token = Math.random().toString(36).substr(2); // יצירת טוקן זמני
            await sendResetPasswordEmail(email, token);
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: "לא נמצא משתמש עם המייל הזה" }, { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "שגיאה בשרת" }, { status: 500 });
    }
}

