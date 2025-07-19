
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { email, language, date, time } = req.body;
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/newsletterpost/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
          body: JSON.stringify({ email, language, date, time }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          return res.status(response.status).json({ message: errorData.message || 'Subscription failed' });
        }
  
        const data = await response.json();
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
  
    return res.status(405).json({ message: 'Method not allowed' });
  }