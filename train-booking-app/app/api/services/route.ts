import prisma from "../../../prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        console.log("Fetching relevant services");
        const { searchParams } = new URL(request.url);
        const origin = searchParams.get("fromLocation");
        const destination = searchParams.get("toLocation");
        const requestedTime = searchParams.get("time");
        console.log("requestedTime",requestedTime)

        // בדוק אם יש פרמטרים חסרים
        if (!origin || !destination || !requestedTime) {
            console.log(origin, destination, requestedTime);
            return NextResponse.json({ message: "Missing required parameters", success: false });
        }

        // המרת זמן לבקשה
        const requestedDateTime = new Date(requestedTime);
        if (isNaN(requestedDateTime.getTime())) {
            return NextResponse.json({ message: "Invalid time format", success: false });
        }

        console.log("Requested DateTime:", requestedDateTime);

        // פונקציה לחיפוש שירותים
        const findServices = async (comparison: 'lte' | 'gte' | 'gt' | 'lt', isAfter: boolean = false) => {
            const services = await prisma.service.findMany({
                where: {
                    exit: origin,
                    destination: destination,
                    OR: [
                        {
                            regularService: {
                                schedules: {
                                    some: {
                                        startTime: { [comparison]: requestedDateTime }
                                    }
                                }
                            }
                        },
                        {
                            oneTimeService: {
                                date: isAfter ? { gt: requestedDateTime } : { lt: requestedDateTime }
                            }
                        }
                    ]
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

            console.log(`Services found with comparison '${comparison}':`, services.length);
            return services;
        };  

        // לפני קריאה לפונקציה, הדפס את הנתונים
        console.log(`Searching for services from ${origin} to ${destination}`);

        // בדוק את כל השירותים כדי לראות את השדות השונים
        const serviceDetails = await prisma.service.findMany({
            where: {
                exit: origin,
                destination: destination
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
        
        console.log("Service details including schedules:", serviceDetails);

        // חיפוש שירות בדיוק בשעה שהמשתמש ביקש
        let relevantService = await findServices('lte');

        console.log('Relevant Services (lte):', relevantService.length);

        // אם לא נמצא שירות בדיוק בשעה, נבדוק שירותים אחרי הבקשה
        if (relevantService.length === 0) {
            console.log("No services found with 'lte'. Searching for services with comparison 'gt'");
            relevantService = await findServices('gt', true);
            console.log('Relevant Services (gt):', relevantService.length);
        }

        // אם עדיין לא נמצא שירות, נבדוק אחד לפני
        if (relevantService.length === 0) {
            console.log("No services found with 'gt'. Searching for services with comparison 'lt'");
            relevantService = await findServices('lt');
            console.log('Relevant Services (lt):', relevantService.length);
        }

        // מיון התוצאות לאחר השליפה לפי סדר זמני עליית השירותים
        relevantService.sort((a, b) => {
            const scheduleA = a.regularService?.schedules[0]?.startTime || a.oneTimeService?.date;
            const scheduleB = b.regularService?.schedules[0]?.startTime || b.oneTimeService?.date;

            if (!scheduleA) return 1;
            if (!scheduleB) return -1;

            return scheduleA > scheduleB ? 1 : -1;
        });

        // החזרת תוצאות
        if (relevantService.length > 0) {
            return NextResponse.json({
                message: "Relevant services retrieved successfully",
                success: true,
                services: relevantService
            });
        }

        return NextResponse.json({
            message: "There are no relevant services",
            success: true,
            services: relevantService
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
