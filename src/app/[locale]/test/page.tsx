"use client";

import React from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
} from "@paypal/react-paypal-js";

interface PayPalOrderResponse {
    id: string;
}

interface PayPalCaptureResponse {
    payer: {
        name: {
            given_name: string;
        };
    };
}

const PayPalCheckout: React.FC = () => {
    // Options for the PayPalScriptProvider

    const initialOptions = {
        clientId: "AXdrrWe0bGqiNVsbDfenXNdCqOeK1267TCQZrTDr3Sxje4xm88w2ulRYJKSpCirzuLvUrW4ojXBL90b9", // Use camelCase here
        "enable-funding": "venmo",
        "disable-funding": "",
        "buyer-country": "US",
        currency: "USD",
        "data-page-type": "product-details",
        components: "buttons",
        "data-sdk-integration-source": "developer-studio",

    };


    const createOrder = async (): Promise<string> => {
        try {
            const response = await fetch("/api/orders/create-paypal-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to create order: ${response.statusText}`);
            }

            const order: PayPalOrderResponse = await response.json();
            return order.id;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    };

    const onApprove = async (data: { orderID: string }): Promise<void> => {
        try {
            const response = await fetch("/api/orders/capture-paypal-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderID: data.orderID,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to capture order: ${response.statusText}`);
            }

            const details: PayPalCaptureResponse = await response.json();
            alert(`Transaction completed by ${details.payer.name.given_name}`);
        } catch (error) {
            console.error("Error capturing order:", error);
            alert("There was an issue completing your transaction. Please try again.");
        }
    };

    return (
        <div>
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{
                        shape: "rect",
                        layout: "vertical",
                        color: "gold",
                        label: "paypal",
                    }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                />
            </PayPalScriptProvider>
        </div>
    );
};

export default PayPalCheckout;














/**
 * 
 * 
'use client'

import React, { useState } from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    PayPalButtonsComponentProps,
} from "@paypal/react-paypal-js";




const PayPalCheckout: React.FC = () => {
    const initialOptions = {
        clientId: "Adws-okWOlM8Wg7I20DznqGuiYPIrfT7D-0WLActs_2zAohP8wruioXYiip0Sixp1szwCO5nO4wSIc5z", // Use camelCase here
        "enable-funding": "venmo",
        "disable-funding": "",
        "buyer-country": "US",
        currency: "USD",
        "data-page-type": "product-details",
        components: "buttons",
        "data-sdk-integration-source": "developer-studio",

    };

   

    const createOrder = async (): Promise<string> => {
        const response = await fetch("http://localhost:3000/api/orders/create-paypal-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const order = await response.json();
        return order.id;
        }



    const onApprove = async (data:any) => {
        try {
const response = await fetch("http://localhost:3000/api/orders/capture-paypal-order", {
    method: "POST",
    body: JSON.stringify({
        orderID: data.orderID})
    });
    if (!response.ok) {
        throw new Error(`Error  
   capturing order: ${response.statusText}`);
      }
 const details = await response.json();


        // Show success message to buyer

        alert(`Transaction completed by ${details.payer.name.given_name}`);
    } catch (error) {
      console.error("Error capturing order:", error);
      // Handle capture error gracefully (e.g., display an error message to the user)
    }
    };

 
    


    return (
        <div>
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{
                        shape: "rect",
                        layout: "vertical",
                        color: "gold",
                        label: "paypal",
                    }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                />
            </PayPalScriptProvider>
         
        </div>
    );
};

export default PayPalCheckout;

 * 
 */
