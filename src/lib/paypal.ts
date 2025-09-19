const base = "https://api-m.sandbox.paypal.com"

async function generateAccessToken() {
    const clientId = 'Adws-okWOlM8Wg7I20DznqGuiYPIrfT7D-0WLActs_2zAohP8wruioXYiip0Sixp1szwCO5nO4wSIc5z'; // Store your CLIENT_ID in environment variables
    const clientSecret = 'EPByIsjeTESBwEv7C8IdI9jyR6kh3FkHNhqOUXzhdb2Yk_i5PBqmrC7OPkq54BOWQSSOopbPyjOrI4w0'; // Store your CLIENT_SECRET in environment variables
  
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'post',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
  const jsonData = await handleResponse(response)
  return jsonData.access_token
}


async function handleResponse(response: any) {
  if (response.status === 200 || response.status === 201) {
    return response.json()
  }

  const errorMessage = await response.text()
  throw new Error(errorMessage)
}

export const paypal = {
  createOrder: async function createOrder() {
        const clientId = 'Adws-okWOlM8Wg7I20DznqGuiYPIrfT7D-0WLActs_2zAohP8wruioXYiip0Sixp1szwCO5nO4wSIc5z'; // Store your CLIENT_ID in environment variables
    const clientSecret = 'EPByIsjeTESBwEv7C8IdI9jyR6kh3FkHNhqOUXzhdb2Yk_i5PBqmrC7OPkq54BOWQSSOopbPyjOrI4w0'; // Store your CLIENT_SECRET in environment variables
  
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
        value: "100.00"
      }
    }
  ],
  payment_source: {
    paypal: {
      experience_context: {
        payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
        brand_name: "EXAMPLE INC",
        locale: "en-US",
        landing_page: "LOGIN",
        shipping_preference: "SET_PROVIDED_ADDRESS",
        user_action: "PAY_NOW",
        return_url: "http://localhost:3000/api/orders/capture-paypal-order",
        cancel_url: "http://localhost:3000/"
      }
    }
  }

}),


});
 const dataa = await response.json();

 const linke = dataa.links.find((link: any) => link.rel === "approve").href;
 console.log(linke)
  return dataa
  },









  capturePayment: async function capturePayment(orderId: string) {

    const accessToken = await generateAccessToken()
    const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.json()
  },
}

/**
purchase_units: [
    {
      items: [
        {
          name: 'casc',
          quantity: '1',
          description: 'Order for casc',
          category: 'PHYSICAL_GOODS',
          unit_amount: {
            currency_code: 'USD',
            value: '100.00',
          },
        },
        {
          name: 'shoes',
          quantity: '1',
          description: 'Order for casc',
          category: 'PHYSICAL_GOODS',
          unit_amount: {
            currency_code: 'USD',
            value: '100.00',
          },
        },
      ],
      amount: {
        currency_code: 'USD',
        value: '200.00', // Total order amount (should match item total)
        breakdown: {
          item_total: {
            currency_code: 'USD',
            value: '200.00', // Total of all items
          },
        },
      },
    },
  ],
  application_context: {
    //return_url:  'http://localhost:3000/api/orders/capture-paypal-order',
    cancel_url:  'http://localhost:3000',
    shipping_preference: 'NO_SHIPPING',
    user_action: 'PAY_NOW',
    brand_name: 'Warmizan.com'
} */