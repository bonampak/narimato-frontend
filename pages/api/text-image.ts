// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generate } from "text-to-image";

import type { NextApiRequest, NextApiResponse } from "next";

type RequestBody = {
    text: string;
    bgColor?: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { text, bgColor } = req.query as unknown as RequestBody;

    if (!text) return res.status(400).json({ error: "Missing text" });

    const imageBase64 = await generate(text, {
        maxWidth: bgColor || 640,
        customHeight: text.length > 184 ? undefined : 500,

        // Font Config
        fontFamily: "Arial",
        fontSize: 40,
        fontWeight: "bold",

        // Text Config
        lineHeight: 50,
        margin: 50,
        textAlign: "center",
        verticalAlign: "middle",

        // Changeable options
        textColor: "blue",
        bgColor: "white"
    });

    // Convert data:image/png;base64 to image
    const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/png;base64,/, ""), "base64");

    // Send image to client
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", imageBuffer.length);
    res.status(200).end(imageBuffer);
}
