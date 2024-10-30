import prisma from "../../../prisma/client";
import { NextResponse } from "next/server";

// פונקציה להוספת שירות (POST)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("body", body);

        // הוספת שירות חדש
        const service = await prisma.service.create({
            data: body
        });

        return NextResponse.json({ message: "success post service", success: true, service });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "failed post service", success: false });
    }
}

// פונקציה להבאת שירותים רלוונטיים לפי פרמטרים של מקור, יעד וזמן (GET)
export async function GET(request: Request) {
    try {
        console.log("aaaaa");

        // קבלת פרמטרים מהשאילתא
        const { searchParams } = new URL(request.url);
        console.log(searchParams.get("fromLocation") + "lllllllllllllll");

        const origin = searchParams.get("fromLocation");
        const destination = searchParams.get("toLocation");
        const startTime = searchParams.get("departureDate"); // פורמט ISO אם יש

        if (!origin || !destination || !startTime) {
            return NextResponse.json({ message: "Missing required parameters", success: false });
        }

        // חיפוש שירותים על פי מקור, יעד וזמן התחלה מתאים
        const relevantServices = await prisma.Service.findMany({
            
            where: {
                exit: "Allenhurst",
                // destination: destination,
                // regularService: {
                //     startTime: {
                //         gte: new Date(startTime) // זמנים שמתחילים באותו יום ושעה או מאוחר יותר
                //     }
                // }
            }
            ,
            include: {
                regularService: true,
                oneTimeService: true
            }
        });
        
        console.log(relevantServices.length + "rrrrr");
        if (relevantServices.length > 0) {
            return NextResponse.json({
                message: "Relevant services retrieved successfully",
                success: true,
                services: relevantServices
            });
        }
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