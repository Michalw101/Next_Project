import prisma from "../../../prisma/client";
import { NextResponse } from "next/server";

/**
 * פונקציה המטפלת בבקשות GET למציאת שירותי רכבת רלוונטיים
 * @param {Request} request - הבקשה שמתקבלת מהקליינט
 * @returns {Promise<NextResponse>} תשובה בפורמט JSON עם פרטי השירותים
 */
export async function GET(request: Request) {
    try {
        console.log("Fetching relevant services");

        // חילוץ הפרמטרים מה-URL של הבקשה
        const { searchParams } = new URL(request.url);
        const exit = searchParams.get("fromLocation");
        const destination = searchParams.get("toLocation");
        const dateTime = searchParams.get("time");
        const passengers = searchParams.get("passengers");

        // בדיקת פרמטרים חסרים
        if (!exit || !destination || !dateTime || !passengers) {
            console.log(exit, destination, dateTime, passengers);
            return NextResponse.json({ message: "Missing required parameters", success: false });
        }

        // המרת פרמטר הזמן והנוסעים לאובייקטים המתאימים
        const hour = parseInt(passengers, 10);
        const numPassengers = parseInt(passengers, 10);

        if (isNaN(hour) || hour < 0 || hour > 23)
            return NextResponse.json({ message: "Invalid time format", success: false });

        if (isNaN(numPassengers) || numPassengers <= 0)
            return NextResponse.json({ message: "passengers number", success: false });


        // פונקציה למציאת שירותי רכבת רלוונטיים
        async function findServices() {
            console.log('findMany');
            const services = await prisma.lineService.findMany({
                where: {
                    line: {
                        exit: exit || "", 
                        destination: destination || "",
                    },
                    hour: {
                        gte: hour,
                    },
                },
                include: {
                    line: true, // הוספת פרטי הקו
                },
                orderBy: {
                    hour: "asc", // מיון לפי שעה
                },
            });

            // חיפוש השירותים על פי מספר מקומות פנויים
            const filteredServices = services.filter(service => {
                return service.availableSeats >= numPassengers;
            });

            // החזרת 3 שירותים הראשונים
            return filteredServices.slice(0, 3);
        }

        let relevantServices = await findServices();
        console.log('relevatServices', relevantServices);

        // אם יש שירותים רלוונטיים, מחזירים אותם
        if (relevantServices.length > 0) {
            return NextResponse.json({
                message: "Relevant services retrieved successfully",
                success: true,
                services: relevantServices
            });
        }

        // במקרה שלא נמצאו שירותים מתאימים
        return NextResponse.json({
            message: "There are no relevant services",
            success: true,
            services: relevantServices
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Failed to retrieve relevant services",
            success: false,
            error: (error as Error).message
        });
    }
   
}
