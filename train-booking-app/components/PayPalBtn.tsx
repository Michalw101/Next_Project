"use client";
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
// import axios from "axios";
// import { cart } from "@/database/cart";

function PayPalBtn() {
  //   const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
  //     try {
  //       const { data } = await axios({
  //         url: "/api/payment/createOrder",
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         data:JSON.stringify({
  //           cart:cart.products
  //         })
  //       });

  //       return data.id;
  //     } catch (error) {
  //       console.error(error);
  //       throw error;
  //     }
  //   };

  //   const onApprove: PayPalButtonsComponentProps["onApprove"] = async (d) => {
  //     // Capture the funds from the transaction.
  //     const { data } = await axios({
  //       url: "/api/payment/capturePayment",
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       data: JSON.stringify({ id:d.orderID }),
  //     });

  //     console.log(data);

  //     // Show success message to buyer
  //     alert(`Transaction completed by`);
  //   };

  // יצירת הזמנה
  const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
    try {
      const response = await fetch("/api/payment/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cart.products,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // אישור תשלום
  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (d) => {
    try {
      const response = await fetch("/api/payment/capturePayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: d.orderID }),
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
    shape: "rect",
    layout: "vertical",
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        intent: "capture",
        currency: "ILS",
      }}
    >
      <PayPalButtons
        style={styles}
        //   createOrder={createOrder}
        //   onApprove={onApprove}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalBtn;
