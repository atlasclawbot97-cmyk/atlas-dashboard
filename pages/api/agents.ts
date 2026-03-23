import type { NextApiRequest, NextApiResponse } from 'next';

let agents = [
  {
    id: 'a-orch-main',
    name: 'Atlas (Orchestrator)',
    kind: 'orchestrator',
    status: 'active',
    activity: 'working',
    lastActivity: 'Coordinated deployment of stand-up reminder and dashboard updates.'
  },
  {
    id: 'a-planner',
    name: 'Planner',
    kind: 'planner',
    status: 'planned',
    activity: 'idle',
    lastActivity: 'Awaiting first planning request (e.g. PersonaPlex roadmap).'
  },
  {
    id: 'a-worker-builder',
    name: 'Builder',
    kind: 'worker',
    status: 'active',
    activity: 'working',
    lastActivity: 'Deployed gradient calculator and stand-up reminder apps.'
  },
  {
    id: 'a-worker-notes',
    name: 'Notetaker',
    kind: 'worker',
    status: 'planned',
    activity: 'idle',
    lastActivity: 'Awaiting activation.'
  },
  {
    id: 'a-canary',
    name: 'Canary',
    kind: 'canary',
    status: 'planned',
    activity: 'idle',
    lastActivity: 'Awaiting first experimental rollout.'
  },
  {
    id: 'a-observer',
    name: 'Observer',
    kind: 'observer',
    status: 'planned',
    activity: 'idle',
    lastActivity: 'Awaiting heartbeat and log wiring.'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(agents);
  }

  if (req.method === 'PATCH') {
    const { id, ...rest } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id is required' });

    agents = agents.map(a => (a.id === id ? { ...a, ...rest } : a));
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).end('Method Not Allowed');
}
