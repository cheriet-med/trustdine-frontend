import type { NextApiRequest, NextApiResponse } from "next";
const apiUrl = process.env.NEXT_PUBLIC_URL || "null";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {

      const { email, password } = req.body;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    
};
}
