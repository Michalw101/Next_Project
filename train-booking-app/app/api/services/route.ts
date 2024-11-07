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
        const requestedTime = searchParams.get("time");
        const passengers = searchParams.get("passengers");

        // בדיקת פרמטרים חסרים
        if (!exit || !destination || !requestedTime || !passengers) {
            console.log(exit, destination, requestedTime, passengers);
            return NextResponse.json({ message: "Missing required parameters", success: false });
        }

        // המרת פרמטר הזמן והנוסעים לאובייקטים המתאימים
        const requestedDateTime = new Date(requestedTime);
        const numPassengers = parseInt(passengers, 10);

        if (isNaN(requestedDateTime.getTime()) || isNaN(numPassengers) || numPassengers <= 0) {
            return NextResponse.json({ message: "Invalid time format or passengers number", success: false });
        }

        console.log("Requested DateTime:", requestedDateTime, "Passengers:", numPassengers);

        // יצירת טווח הזמן להיום (התחלה ועד סוף היום)
        const startOfDay = new Date(requestedDateTime.setHours(0, 0, 0, 0));
        const endOfDay = new Date(requestedDateTime.setHours(23, 59, 59, 999));

        /**
         * פונקציה למציאת שירותי רכבת החל מהזמן המבוקש ועד סוף היום הנוכחי
         * @returns {Promise<Array>} מערך של שירותים רלוונטיים
         */
        const findServices = async () => {
            const services = await prisma.service.findMany({
                where: {
                    exit: exit,
                    destination: destination,
                    OR: [
                        {
                            regularService: {
                                schedules: {
                                    some: {
                                        startTime: {
                                            gte: startOfDay,
                                            lt: endOfDay
                                        }
                                    }
                                }
                            }
                        },
                        {
                            oneTimeService: {
                                date: {
                                    gte: startOfDay,
                                    lt: endOfDay
                                }
                            }
                        }
                    ],
                    availableSeatsA: {
                        gte: numPassengers
                    }
                },
                include: {
                    regularService: {
                        include: {
                            schedules: true
                        }
                    },
                    oneTimeService: true
                }
            });

            // מיון שירותים לפי startTime (בשירותים רגילים)
            const sortedServices = services.sort((a, b) => {
                const timeA = a.regularService?.schedules[0]?.startTime || a.oneTimeService?.date;
                const timeB = b.regularService?.schedules[0]?.startTime || b.oneTimeService?.date;

                if (!timeA) return 1;
                if (!timeB) return -1;
                return new Date(timeA).getTime() - new Date(timeB).getTime();
            });

            console.log(`Services found:`, sortedServices.length);
            return sortedServices;
        };

        // שליפת השירותים הרלוונטיים
        let relevantServices = await findServices();

        // סינון התוצאות להחזרת השירות המבוקש ושלושת הבאים אחריו
        relevantServices = relevantServices.slice(0, 4);

        // החזרת תוצאה עם השירותים שנמצאו
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
