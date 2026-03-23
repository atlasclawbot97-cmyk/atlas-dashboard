import type { NextApiRequest, NextApiResponse } from 'next';

let tasks: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { ownerAgent, status, planId } = req.query;
    let filtered = tasks;

    if (ownerAgent) filtered = filtered.filter(t => t.ownerAgent === ownerAgent);
    if (status) filtered = filtered.filter(t => t.status === status);
    if (planId) filtered = filtered.filter(t => t.planId === planId);

    return res.status(200).json(filtered);
  }

  if (req.method === 'POST') {
    const task = req.body;
    if (!task?.id) return res.status(400).json({ error: 'Task id is required' });

    const now = new Date().toISOString();
    tasks.push({
      ...task,
      createdAt: task.createdAt || now,
      updatedAt: now
    });
    return res.status(201).json(task);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
