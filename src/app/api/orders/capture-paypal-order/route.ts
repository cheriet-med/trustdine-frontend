







export const POST = async (...request:any) => {
  try {
    const [req] = request;
    const { orderID } = await req.json();

    console.log("Received orderID:", orderID);

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing PayPal client ID or secret");
    }

    // Step 1: Obtain OAuth token
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: `grant_type=client_credentials`,
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch PayPal token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    if (!token) {
      throw new Error("Failed to retrieve access token from PayPal");
    }

    // Step 2: Capture the order
    const captureUrl = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`;
    const captureResponse = await fetch(captureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!captureResponse.ok) {
      const errorDetails = await captureResponse.text();
      throw new Error(`Order capture failed: ${captureResponse.statusText}. Details: ${errorDetails}`);
    }

    const captureData = await captureResponse.json();
    console.log("Capture response:", captureData);

    // Return successful capture response
    return new Response(JSON.stringify(captureData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error capturing order:", error);
    
  }
};








/**
 * 
 * 
export const POST = async (...request: any) => {
  try {
  const [req, { params }] = request
  const { orderID } = await req.json()
  console.log("Received orderID:", orderID);

  const clientId = process.env.PAYPAL_CLIENT_ID; // Store your CLIENT_ID in environment variables
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET; // Store your CLIENT_SECRET in environment variables
  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal client ID or secret");
  }
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


  const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const dataa = await response.json();
  console.log("Capture response:", dataa);
  console.log("this is the url for post method",url)
  // const linke = dataa.links.find((link: any) => link.rel === "approve").href;
  // console.log(linke)
    return Response.json(dataa)
  } catch (error) {
    console.error("Error capturing order:", error);
    // Handle capture error gracefully (e.g., return an appropriate HTTP status code)
  }
} 




urns 
 */
