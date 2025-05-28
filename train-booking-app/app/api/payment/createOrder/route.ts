import { generateToken } from "@/actions/createTokenPaypal";
import { NextResponse } from "next/server";
import axios from "axios";



export const POST = async (req: Request) => {
  try{
    const token = await generateToken();
    if (!token) throw new Error("Token not exists");
    const {data} = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "ILS",
              value: "100",
            },
            description: "Train Ticket Booking",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("Response data:", data);


  return NextResponse.json(
    { success: true, message: "Order created successfully", id: data.id },
    { status: 200 }
  );
} catch (error) {
  return NextResponse.json(
    { success: false, message: "Failed to create order", error: error.response ? error.data : error.message },
    { status: 500 }
  );
}
}

//     // // 🔹 קבל מידע על הנסיעה
//     // const lineDetails = await prisma.lineDetails.findUnique({
//     //   where: { id_lineDetails: lineDetailsId },
//     // });

//     // if (!lineDetails) throw new Error("Line details not found");
//     // if (lineDetails.availableSeats < numOfSeats) throw new Error("Not enough available seats");

//     // // 🔹 צור הזמנה בבסיס הנתונים
//     // const newOrder = await prisma.order.create({
//     //   data: {
//     //     numOfSeats,
//     //     id_User: userId,
//     //     id_LineDetails: lineDetailsId,
//     //   },
//     // });

//     // // 🔹 עדכן את מספר המושבים הזמינים בנסיעה
//     // await prisma.lineDetails.update({
//     //   where: { id_lineDetails: lineDetailsId },
//     //   data: { availableSeats: lineDetails.availableSeats - numOfSeats },
//     // });

//     // 🔹 צור הזמנה ב-PayPal
//     const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         intent: "CAPTURE",
//         purchase_units: [
//           {
//               amount: {
//                   currency_code: "ILS", // ודאי שהמטבע נכון
//                   value: "100", // ודאי שהסכום נכון
//               },
//               description: "Train Ticket Booking",
//           },
//       ],
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`PayPal API error: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
//     console.log("Order created:", data);

//     return NextResponse.json(
//       { success: true, message: "Order created successfully", id: data.id, orderId: newOrder.id_orders },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: "Failed to create order", error: error instanceof Error ? error.message : error },
//       { status: 500 }
//     );
//   }
// };

