



export const POST = async () => {
  try {
    // Environment variables for security
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const baseUrl = process.env.BASE_URL; // Unused but kept if needed later

    if (!clientId || !clientSecret) {
      throw new Error("Missing PayPal CLIENT_ID or CLIENT_SECRET in environment variables.");
    }

    // Generate Basic Auth for PayPal API
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    // Step 1: Get OAuth token
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch PayPal OAuth token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    if (!token) {
      throw new Error("Failed to retrieve access token from PayPal.");
    }

    // Step 2: Create PayPal Order
    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: "d9f80740-38f0-11e8-b467-0ed5f89f718b",
            amount: {
              currency_code: "USD",
              value: "100",
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              brand_name: "EXAMPLE INC",
              user_action: "PAY_NOW",
              return_url: "http://localhost:3000/api/orders/capture-paypal-order",
              cancel_url: "http://localhost:3000/",
            },
          },
        },
      }),
    });

    if (!orderResponse.ok) {
      throw new Error(`Failed to create PayPal order: ${orderResponse.statusText}`);
    }

    const orderData = await orderResponse.json();

    // Optionally log or process the approval link
    // const approvalLink = orderData.links.find(link => link.rel === "approve").href;
    // console.log(`Approval link: ${approvalLink}`);

    return Response.json(orderData);
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    //return Response.json({ error: error.message }, { status: 500 });
  }
};















/**
 * 
 * 
 * 

export const POST = async () => {
      const clientId = process.env.PAYPAL_CLIENT_ID; // Store your CLIENT_ID in environment variables
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET; // Store your CLIENT_SECRET in environment variables
      const base = process.env.BASE_URL
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const neo =  await fetch(
        'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${auth}`,
          },
          body: `grant_type=client_credentials`,
        }
      ); 
      const data = await neo.json();
      const token = data.access_token
  
  
  
  const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    
    Authorization: `Bearer ${token}`,
  
  },
  body: JSON.stringify({
    intent: 'CAPTURE',
   purchase_units: [
    {
      reference_id: "d9f80740-38f0-11e8-b467-0ed5f89f718b",
      amount: {
        currency_code: "USD",
        value: "100"
      }
    }
  ],
  payment_source: {
    paypal: {
      experience_context: {
        payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
        brand_name: "EXAMPLE INC",
        //locale: "en-US",
        //landing_page: "LOGIN",
        //shipping_preference: "SET_PROVIDED_ADDRESS",
        user_action: "PAY_NOW",
        return_url: "http://localhost:3000/api/orders/capture-paypal-order",
        cancel_url: "http://localhost:3000/"
      }
    }
  }
  }),
  
  
  });
   const dataa = await response.json();
  
  // const linke = dataa.links.find((link: any) => link.rel === "approve").href;
  // console.log(linke)
    return Response.json(dataa)
   
}
 */