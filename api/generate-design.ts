import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

const schema = {
  type: Type.OBJECT,
  properties: {
    template: { type: Type.STRING, enum: ['professional','ethereal','bohemian','minimalistic','youtube_bold','tech_saas'] },
    bgStyle: { type: Type.STRING, enum: ['midnight','crimson','obsidian','corporate','digital','emerald'] },
    title: { type: Type.STRING },
    subtitle: { type: Type.STRING },
    category: { type: Type.STRING },
    keyPills: { type: Type.ARRAY, items: { type: Type.STRING } },
    textScale: { type: Type.NUMBER },
  },
  required: ['template','bgStyle','title','subtitle','category','keyPills','textScale'],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'AI is not configured; local design engine remains available.' });

  try {
    const { title = '', subtitle = '', category = '' } = req.body || {};
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are the creative director for NailedIt, a premium thumbnail design engine. Analyze the content and return a compact design plan. Preserve factual meaning; never invent claims. The thumbnail must be readable at small sizes, use 1-2 strong visual ideas, avoid clutter, and prefer a short punchy hook while keeping the user's original title available. Choose the best template and theme from the allowed values.\n\nTitle: ${String(title).slice(0, 240)}\nSubtitle: ${String(subtitle).slice(0, 300)}\nCategory: ${String(category).slice(0, 120)}`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.35,
      },
    });

    const text = result.text || '{}';
    const plan = JSON.parse(text);
    return res.status(200).json(plan);
  } catch (error) {
    console.error('NailedIt AI design error', error);
    return res.status(500).json({ error: 'AI design failed; use the local design engine.' });
  }
}
