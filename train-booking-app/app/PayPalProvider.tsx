"use client";

import { PropsWithChildren } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function PaypalProvider({ children }: PropsWithChildren) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
        intent: "capture",
        currency: "ILS",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}

export default PaypalProvider;
