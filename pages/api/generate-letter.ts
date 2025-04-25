import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { idea, reason } = req.body;

  const prompt = `
Write a heartfelt letter from your future self to your current self. You're looking back at your life, realizing you never followed through on your idea: "${idea}". Talk about the regrets and missed opportunities. Emphasize why it was important: "${reason}". Make it emotionally compelling and personal.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();

  const letter = data.choices?.[0]?.message?.content || 'Sorry, something went wrong.';

  res.status(200).json({ letter });
}
