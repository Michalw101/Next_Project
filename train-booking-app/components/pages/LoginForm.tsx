"use client";

import React, { FormEvent, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.currentTarget;

    const values = {
      email: target.email.value,
      password: target.password.value,
    };

    try {
      const credential = await signIn("credentials", {
        ...values,
        callbackUrl: "/",
      });
      console.log("credential", credential);
    } catch (error) {
      console.log(error);
    }
  }

  async function register(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.currentTarget;

    const values = {
      email: target.email.value,
      password: target.password.value,
      //@ts-ignore
      name: target.name.value,
    };
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = "/";
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="pt-16 w-full h-screen bg-no-repeat bg-center bg-fixed"
      style={{
        backgroundImage: "url(/images/profile_pic.jpg)",
        backgroundSize: "cover",
      }}
    >
     
      <div className="flex flex-col w-full justify-center items-center my-5">
        <form onSubmit={isLogin ? handleSubmit : register} className="w-full">
          <h1 className="text-center text-xl font-semibold">
            {isLogin ? "Login" : "Register"}
          </h1>
          {!isLogin && (
            <InputLogin
              label="Name"
              type="name"
              id="name"
              name="name"
              placeholder="Type Name..."
            />
          )}
          <InputLogin
            label="Email"
            type="email"
            id="email"
            name="email"
            placeholder="Type Email..."
          />
          <InputLogin
            label="Password"
            type="password"
            id="password"
            name="password"
            placeholder="Type Password..."
          />
          <p
            onClick={() => setIsLogin((prev) => !prev)}
            className="justify-start text-blue-700/80 text-2xl font-normal font-['Simona_Pro']"
          >
            You haven't Account? - Sign Up
          </p>
          <br />
          <br />
          <p className="justify-start text-blue-700/80 text-2xl font-normal font-['Simona_Pro']">
            <a href="/forgot-password">
              Did you forget your password? - Press Here
            </a>
          </p>
          <div className="w-full flex justify-center items-center">
            <button
              type="submit"
              className="w-[822.26px] h-28 bg-blue-700 rounded-[80px]"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
        {/* Google BTN */}
        <div className="flex w-full flex-col justify-center items-center gap-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex w-[80%] items-center justify-center bg-white
         dark:bg-gray-900 border border-gray-300 rounded-lg 
         shadow-md px-6 py-2 text-sm font-medium text-gray-800
          dark:text-white hover:bg-gray-200 focus:outline-none 
          focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <FaGoogle className="h-6 w-6 mr-2" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

type InputLoginProps = {
  label: string;
  type: string;
  id: string;
  name: string;
  placeholder: string;
};

function InputLogin({ label, ...props }: InputLoginProps) {
  return (
    <>
      <div className="mb-6 w-full">
        <label
          htmlFor="default-input"
          className="block w-[80%] mx-auto mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <input
          {...props}
          className="bg-gray-50 border border-gray-300
           text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500
             block w-[80%] mx-auto p-2.5 dark:bg-gray-700
              dark:border-gray-600 dark:placeholder-gray-400
               dark:text-white dark:focus:ring-blue-500
                dark:focus:border-blue-500"
        />
      </div>
    </>
  );
}



// כדי להוסיף פונקציה של "שכחתי סיסמא" ב-Next.js, תצטרך לממש את הצעד הבא:

// ### 1. יצירת דף של "שכחתי סיסמא"
// הדף הזה יאפשר למשתמש להכניס את כתובת הדוא"ל שלו כדי לשלוח קישור לשחזור הסיסמא.

// #### יצירת דף `forgot-password.tsx`

// ```tsx
// // pages/forgot-password.tsx
// import { useState } from "react";

// const ForgotPassword = () => {
//     const [email, setEmail] = useState("");
//     const [message, setMessage] = useState<string | null>(null);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         // שלח את הדוא"ל לשרת (תצטרך לממש את ה-API)
//         try {
//             const response = await fetch("/api/forgot-password", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ email }),
//             });

//             const data = await response.json();
//             if (data.success) {
//                 setMessage("קישור לשחזור סיסמא נשלח לדוא"ל שלך.");
//             } else {
//                 setMessage("לא הצלחנו למצוא את הדוא"ל הזה.");
//             }
//         } catch (error) {
//             console.log(error);
//             setMessage("הייתה בעיה, אנא נסה שוב מאוחר יותר.");
//         }
//     };

//     return (
//         <div className="forgot-password">
//             <h1>שכחת סיסמא?</h1>
//             <form onSubmit={handleSubmit}>
//                 <label htmlFor="email">כתובת דוא"ל</label>
//                 <input
//                     type="email"
//                     id="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <button type="submit">שלח קישור לשחזור</button>
//             </form>
//             {message && <p>{message}</p>}
//         </div>
//     );
// };

// export default ForgotPassword;
// ```

// הדף הזה יאפשר למשתמש להזין את כתובת הדוא"ל שלו ולשלוח בקשה לשחזור סיסמא.

// ### 2. יצירת API לשחזור סיסמא

// כעת תצטרך ליצור API ב-Next.js שיעבוד עם הדוא"ל שהוזן. תוכל לשלוח דוא"ל עם קישור לשחזור סיסמא (למשל, באמצעות ספריית `nodemailer`).

// #### יצירת API ב-Next.js לשחזור סיסמא

// ```ts
// // pages/api/forgot-password.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import nodemailer from "nodemailer";

// // פונקציה לשלוח דוא"ל לשחזור סיסמא
// const sendResetPasswordEmail = async (email: string, token: string) => {
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER, // האימייל שלך
//             pass: process.env.EMAIL_PASS, // הסיסמא לאימייל שלך או גישה לאפליקציה
//         },
//     });

//     const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: "בקשה לשחזור סיסמא",
//         text: `לחץ כאן כדי לשחזר את הסיסמא שלך: ${resetUrl}`,
//     };

//     await transporter.sendMail(mailOptions);
// };

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//     if (req.method === "POST") {
//         const { email } = req.body;

//         // תחפשו את המשתמש לפי הדוא"ל במסד נתונים (למשל, עם Prisma)
//         // עבור הדוגמה, נניח שהמשתמש קיים
//         const user = { email: "example@example.com" }; // מחליף עם חיפוש במאגר נתונים אמיתי

//         if (user) {
//             // יצירת טוקן ייחודי לשחזור סיסמא
//             const token = Math.random().toString(36).substr(2);

//             // שליחת אימייל עם קישור לשחזור
//             try {
//                 await sendResetPasswordEmail(email, token);
//                 res.status(200).json({ success: true });
//             } catch (error) {
//                 console.error(error);
//                 res.status(500).json({ success: false, message: "לא הצלחנו לשלוח את הדוא"ל" });
//             }
//         } else {
//             res.status(404).json({ success: false, message: "לא נמצא משתמש עם הדוא"ל הזה" });
//         }
//     } else {
//         res.status(405).json({ success: false, message: "שיטה לא נתמכת" });
//     }
// };
// ```

// ### 3. יצירת דף "שחזור סיסמא" (Reset Password)

// לאחר שהמשתמש יקבל את הדוא"ל, הוא ילחץ על הקישור ויגיע לדף שבו יוכל להגדיר סיסמא חדשה.

// #### יצירת דף `reset-password.tsx`

// ```tsx
// // pages/reset-password.tsx
// import { useState } from "react";
// import { useRouter } from "next/router";

// const ResetPassword = () => {
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [message, setMessage] = useState<string | null>(null);
//     const router = useRouter();
//     const { token } = router.query; // טוקן שנשלח בקישור

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (password !== confirmPassword) {
//             setMessage("הסיסמאות לא תואמות");
//             return;
//         }

//         try {
//             const response = await fetch("/api/reset-password", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ token, password }),
//             });

//             const data = await response.json();
//             if (data.success) {
//                 setMessage("הסיסמא שונתה בהצלחה");
//             } else {
//                 setMessage("לא ניתן לשנות את הסיסמא");
//             }
//         } catch (error) {
//             console.log(error);
//             setMessage("הייתה בעיה, אנא נסה שוב מאוחר יותר.");
//         }
//     };

//     return (
//         <div>
//             <h1>שחזור סיסמא</h1>
//             <form onSubmit={handleSubmit}>
//                 <label htmlFor="password">סיסמא חדשה</label>
//                 <input
//                     type="password"
//                     id="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <label htmlFor="confirmPassword">אשר סיסמא</label>
//                 <input
//                     type="password"
//                     id="confirmPassword"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit">שנה סיסמא</button>
//             </form>
//             {message && <p>{message}</p>}
//         </div>
//     );
// };

// export default ResetPassword;
// ```

// ### 4. API לשחזור סיסמא

// תצטרך API נוסף שיבדוק את הטוקן ויאפשר למשתמש לשנות את הסיסמא.

// ```ts
// // pages/api/reset-password.ts
// import { NextApiRequest, NextApiResponse } from "next";

// // הדמיה של פונקציה לשינוי סיסמא
// const resetPassword = async (token: string, newPassword: string) => {
//     // לבדוק אם הטוקן תקף ואז לעדכן את הסיסמא במסד הנתונים
//     console.log(`Resetting password for token: ${token} with new password: ${newPassword}`);
//     // זה המקום להכניס את הלוגיקה להחלפת הסיסמא במאגר הנתונים
// };

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//     if (req.method === "POST") {
//         const { token, password } = req.body;

//         // קריאה לפונקציה לשחזור סיסמא
//         try {
//             await resetPassword(token, password);
//             res.status(200).json({ success: true });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ success: false, message: "שגיאה בשחזור הסיסמא" });
//         }
//     } else {
//         res.status(405).json({ success: false, message: "שיטה לא נתמכת" });
//     }
// };
// ```

// ### סיכום:
// 1. **שכחתי סיסמא** - דף שבו המשתמש מכניס את הדוא"ל שלו, ונשלח לו קישור לשחזור.
// 2. **שחזור סיסמא** - דף שבו המשתמש משנה את הסיסמא לאחר שלחץ על הקישור.
// 3. **API** - כל API דוא"ל שנשלח ושימוש בטוקן לשחזור הסיסמא.

// בהצלחה!
