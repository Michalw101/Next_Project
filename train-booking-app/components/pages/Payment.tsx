"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";


const PaymentForm = () => {
  const searchParams = useSearchParams();
  const tripDetailsParam = searchParams.get("tripDetails");
  const tripDetails = tripDetailsParam
    ? JSON.parse(decodeURIComponent(tripDetailsParam))
    : null;
  const origin = tripDetails?.Line?.exit || "לא צוין מוצא";
  const destination = tripDetails?.Line?.destination || "לא צוין יעד";
  const date = tripDetails?.date || "לא צוין תאריך";
  const time = tripDetails?.departureTime || "לא צוינה שעה";
  const price = tripDetails?.Line?.price || 0;
  const [passengers, setPassengers] = useState(1);

  const handleIncrease = () => setPassengers((prev) => prev + 1);
  const handleDecrease = () =>
    setPassengers((prev) => (prev > 1 ? prev - 1 : 1));
  const totalPrice = passengers * price;

  const { data: session } = useSession();
  const userId= session?.user?.id;
  


  const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
    try {
      const response = await fetch("/api/payment/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: [{ id: tripDetails.id, quantity: passengers }],
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }
  
      const data = await response.json();
      console.log("Order created:", data);
      return data.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };
  
  // lineDetailsId: tripDetails.id,
  //         numOfSeats:passengers,
  //         totalPrice:totalPrice,
  //         userId:userId
  
  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (d) => {
    try {
      const lineDetailsId = tripDetails.id_lineDetails;
      console.log("lineDetailsId:", tripDetails.id_lineDetails)
      const response = await fetch("/api/payment/capturePayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: d.orderID,
          lineDetailsId: lineDetailsId,
          numOfSeats:passengers,
          userId:userId
         }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to capture payment");
      }
  
      const data = await response.json();
      console.log(data);
  
      // הצגת הודעה למשתמש
      alert("Transaction completed successfully!");
    } catch (error) {
      console.error(error);
      alert("Payment failed. Please try again.");
    }
  };
  
  const styles: PayPalButtonsComponentProps["style"] = {
    shape: "sharp",
    layout: "vertical",
    color: "silver"
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-right">פרטי הזמנה</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-6 text-right">
        <p>
          <strong>מוצא:</strong> {origin}
        </p>
        <p>
          <strong>יעד:</strong> {destination}
        </p>
        <p>
          <strong>תאריך:</strong> {date}
        </p>
        <p>
          <strong>שעה:</strong> {time}
        </p>
        <div className="flex items-center mt-2">
          <strong>כמות נוסעים:</strong>
          <button
            onClick={handleDecrease}
            className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
          >
            -
          </button>
          <span className="mx-2">{passengers}</span>
          <button
            onClick={handleIncrease}
            className="px-2 py-1 bg-green-500 text-white rounded"
          >
            +
          </button>
        </div>
        <p className="mt-2">
          <strong>מחיר כולל:</strong> {totalPrice} ₪
        </p>
      </div>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          intent: "capture",
          currency: "ILS",
        }}
      >
        <PayPalButtons
            style={styles}
            createOrder={createOrder}
            onApprove={onApprove}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PaymentForm;
