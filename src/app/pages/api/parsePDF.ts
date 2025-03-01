import pdf from "pdf-parse";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Ensure we are receiving a base64 file string
    const { file } = req.body;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Convert base64 string to Buffer
    const fileBuffer = Buffer.from(file, "base64");
    const data = await pdf(fileBuffer);

    return res.status(200).json({ text: data.text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return res.status(500).json({ error: "Failed to process PDF" });
  }
}
