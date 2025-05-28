import { generateToken } from "@/actions/createTokenPaypal";
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const POST = async (req: Request) => {
  const { id, lineDetailsId, numOfSeats, userId } = await req.json();
  try {
    const token = await generateToken();
    if (!token) throw new Error("Token not Exists");

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${id}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to capture order. Status: ${response.status}`);
    }

    const data = await response.json();

    
    const order = await addOrder(lineDetailsId, numOfSeats, userId);
    return NextResponse.json(
      { success: true, message: "success capture Order", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "not success capture Order", error: (error as Error).message },
      { status: 500 }
    );
  }
};


const addOrder = async function (lineDetailsId:any,numOfSeats:any,userId:any) {
  try{
    const lineDetails = await prisma.lineDetails.findUnique({
      where: { id_lineDetails: lineDetailsId },
    });

    if (!lineDetails) throw new Error("Line details not found");
    if (lineDetails.availableSeats < numOfSeats) throw new Error("Not enough available seats");

    // 🔹 צור הזמנה בבסיס הנתונים
    const newOrder = await prisma.order.create({
      data: {
        numOfSeats,
        id_User: userId,
        id_LineDetails: lineDetailsId,
      },
    });

    // 🔹 עדכן את מספר המושבים הזמינים בנסיעה
    await prisma.lineDetails.update({
      where: { id_lineDetails: lineDetailsId },
      data: { availableSeats: lineDetails.availableSeats - numOfSeats },
    });
    console.log("Order created successfully:", newOrder);
    return NextResponse.json({ message: "Order created successfully", success: true, newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ message: "Failed to create order", success: false }, { status: 500 });
  }

}

