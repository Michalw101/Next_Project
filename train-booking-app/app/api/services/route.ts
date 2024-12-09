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
    const exit = searchParams.get("fromLocation") || ""; // ברירת מחדל ריקה במקרה של null
    const destination = searchParams.get("toLocation") || "";
    const dateTimeFormat = searchParams.get("time") || "";
    const passengers = searchParams.get("passengers") || "";

    // בדיקת פרמטרים חסרים
    if (!exit || !destination || !dateTimeFormat || !passengers) {
      console.log(exit, destination, dateTimeFormat, passengers);
      return NextResponse.json({
        message: "Missing required parameters",
        success: false,
      });
    }

    const fdateTime = new Date(dateTimeFormat);

    // הוצאת חלקי התאריך (שנה, חודש, יום)
    const year = fdateTime.getFullYear();
    const month = String(fdateTime.getMonth() + 1).padStart(2, "0"); // חודשים הם מ-0 עד 11, אז מוסיפים 1
    const day = String(fdateTime.getDate()).padStart(2, "0"); // מוסיפים אפס מוביל אם יש צורך
    const hour = String(fdateTime.getHours()).padStart(2, "0"); // מוסיפים אפס מוביל אם יש צורך
    const minute = String(fdateTime.getMinutes()).padStart(2, "0");

    // בניית הפורמט הרצוי
    const dateTime = `${year}-${month}-${day}`;
    const time = `${hour}:${minute}`; 
   console.log("Formatted date and time:", dateTime, time);

    
    console.log(
        "exit",
        exit,
        "destination",
        destination,
        "dateTime",
         dateTime,
        "passengers",
        passengers
      );

    // המרת פרמטר הזמן והנוסעים לאובייקטים המתאימים
    const numPassengers = parseInt(passengers, 10);

    if (isNaN(numPassengers) || numPassengers <= 0)
      return NextResponse.json({
        message: "Invalid passengers number",
        success: false,
      });

    // פונקציה למציאת שירותי רכבת רלוונטיים
    async function findServices() {
      console.log("Searching for services");
      const services = await prisma.lineDetails.findMany({
        where: {
          AND: [
            {
              stations: {
                hasSome: [exit, destination], // לוודא שתחנות המוצא והיעד קיימות
              },
            },
            {
              departureTime: {
                gte: time, // לוודא שהשעה גדולה או שווה לשעה המבוקשת
              },
            },
            {
              availableSeats: {
                gte: numPassengers, // לוודא שיש מספיק מקומות
              },
            },
          ],
        },
        include: {
          Line: true, // הוספת פרטי הקו
        },
        orderBy: {
          departureTime: "asc", // מיון לפי זמן יציאה
        },
      });

      return services
        .filter((service) => {
          const exitIndex = service.stations.indexOf(exit);
          const destinationIndex = service.stations.indexOf(destination);

          return (
            exitIndex !== -1 &&
            destinationIndex !== -1 &&
            exitIndex < destinationIndex
          );
        })
        .slice(0, 3); // החזרת 3 שירותים הראשונים
    }

    let relevantServices = await findServices();
    console.log("relevantServices", relevantServices);

    // אם יש שירותים רלוונטיים, מחזירים אותם
    if (relevantServices.length > 0) {
      return NextResponse.json({
        message: "Relevant services retrieved successfully",
        success: true,
        services: relevantServices,
      });
    }

    // במקרה שלא נמצאו שירותים מתאימים
    return NextResponse.json({
      message: "There are no relevant services",
      success: true,
      services: relevantServices,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Failed to retrieve relevant services",
      success: false,
      error: (error as Error).message,
    });
  }
}
