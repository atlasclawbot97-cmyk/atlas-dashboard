import type { NextApiRequest, NextApiResponse } from 'next';

let plans: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(plans);
  }

  if (req.method === 'POST') {
    const plan = req.body;
    if (!plan?.id) return res.status(400).json({ error: 'Plan id is required' });

    plans.push({
      ...plan,
      createdAt: plan.createdAt || new Date().toISOString()
    });
    return res.status(201).json(plan);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
