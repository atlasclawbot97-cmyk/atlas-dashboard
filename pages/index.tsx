import Head from 'next/head';
import { useEffect, useState } from 'react';

// Types

type Agent = {
  id: string;
  name: string;
  kind: string;
  status: string;
  activity: string;
  role?: string;
  lastActivity?: string;
};

type Task = {
  id: string;
  title: string;
  status: 'inbox' | 'doing' | 'blocked' | 'done';
  ownerAgent: string;
  type?: string;
  priority?: 'low' | 'medium' | 'high';
  planId?: string;
  phaseId?: string;
  notes?: string;
};

// Components (ported from app.jsx)

function Badge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    online: 'Online',
    idle: 'Idle',
    error: 'Error',
    planned: 'Planned'
  };
  const label = labels[status] || status;
  return (
    <span className="badge">
      <span className={`badge-dot ${status}`} />
      {label}
    </span>
  );
}

function TaskColumn({ title, tasks }: { title: string; tasks: Task[] }) {
  return (
    <div>
      <div className="column-title">{title}</div>
      {tasks.length === 0 && (
        <div className="list-meta">Nothing here right now.</div>
      )}
      {tasks.map((t) => (
        <div key={t.id} className="task-card">
          <div className="task-title">{t.title}</div>
          <div className="task-meta">
            <span className={`tag type-${t.type}`}>{t.type}</span>
            <span className={`priority ${t.priority}`}>
              {t.priority
                ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1)
                : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function IssuesList({ issues }: { issues: any[] }) {
  if (!issues.length) return <div className="list-meta">No issues tracked.</div>;
  return (
    <div className="list">
      {issues.map((issue) => (
        <div key={issue.id} className="list-item">
          <div className="list-label">{issue.label}</div>
          <div className="list-meta">{issue.detail}</div>
        </div>
      ))}
    </div>
  );
}

function AgentsList({ agents }: { agents: Agent[] }) {
  if (!agents.length) return <div className="list-meta">No agents defined.</div>;
  return (
    <div className="list">
      {agents.map((agent) => (
        <div key={agent.id} className="list-item">
          <div className="list-label">{agent.name}</div>
          <div className="list-meta">
            {agent.kind} · {agent.status}{agent.role ? ` · ${agent.role}` : ''}
          </div>
        </div>
      ))}
    </div>
  );
}

function AppsList({ apps }: { apps: any[] }) {
  if (!apps.length) return <div className="list-meta">No apps yet.</div>;
  return (
    <div className="list">
      {apps.map((app) => (
        <div key={app.id} className="list-item">
          <div className="list-label">{app.name}</div>
          <div className="list-meta">
            <div className="link-row">
              <span className="link-chip"><a href={app.url} target="_blank" rel="noreferrer">Live</a></span>
              <span className="link-chip"><a href={app.repo} target="_blank" rel="noreferrer">Repo</a></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function IdeasList({ ideas }: { ideas: any[] }) {
  if (!ideas.length) return <div className="list-meta">No ideas yet.</div>;
  return (
    <div className="list">
      {ideas.map((idea: any) => (
        <div key={idea.id} className="list-item">
          <div className="list-label">{idea.title}</div>
          <div className="list-meta">{idea.detail}</div>
        </div>
      ))}
    </div>
  );
}

function Office({ agents }: { agents: Agent[] }) {
  if (!agents.length) return null;

  const emojiForKind = (kind: string, name: string) => {
    if (name.toLowerCase().includes('atlas')) return '🌍';
    if (kind === 'orchestrator') return '🎛️';
    if (kind === 'worker') return '🛠️';
    if (kind === 'observer') return '👁️';
    if (kind === 'canary') return '🧪';
    if (kind === 'planner') return '🧠';
    return '🤖';
  };

  const labelForActivity = (activity?: string) => {
    switch (activity) {
      case 'working':
        return 'Working';
      case 'waiting':
        return 'Waiting';
      case 'idle':
        return 'Idle';
      case 'planned':
        return 'Planned';
      default:
        return activity || 'Idle';
    }
  };

  return (
    <section className="card">
      <div className="card-header">
        <div className="card-title">Atlas Office</div>
        <span className="badge">Fleet overview</span>
      </div>
      <div className="office">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`desk ${agent.activity || ''} ${agent.status || ''}`.trim()}
          >
            <div className="desk-header">
              <div className="desk-main">
                <div className="desk-avatar">
                  {emojiForKind(agent.kind, agent.name)}
                </div>
                <div>
                  <div className="desk-title">{agent.name}</div>
                  <div className="desk-role">{agent.role}</div>
                </div>
              </div>
              <div
                className={`desk-activity ${agent.activity || 'idle'}`}
              >
                {labelForActivity(agent.activity)}
              </div>
            </div>
            <div className="desk-footer">
              {agent.lastActivity || 'No recent activity recorded.'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<{ inbox: Task[]; doing: Task[]; done: Task[] }>(
    { inbox: [], doing: [], done: [] }
  );
  const [error, setError] = useState<string | null>(null);

  const atlas = {
    name: 'Atlas',
    emoji: '🌍',
    status: 'online',
    mode: 'main orchestrator',
    timezone: 'Europe/Stockholm',
    notes: "Running inside OpenClaw on Rayan's machine. Orchestrating a small fleet of agents."
  };

  const issues = [
    {
      id: 'i-1',
      label: 'web_search disabled',
      detail: 'Gemini API key not configured; cannot perform live web search.'
    },
    {
      id: 'i-2',
      label: 'Execution policy',
      detail: "PowerShell execution policy blocks 'openclaw' script directly."
    }
  ];

  const apps = [
    {
      id: 'app-click-counter',
      name: 'Click Counter',
      repo: 'https://github.com/atlasclawbot97-cmyk/click-counter',
      url: 'https://atlasclawbot97-cmyk.github.io/click-counter/'
    },
    {
      id: 'app-calculator',
      name: 'Gradient Calculator',
      repo: 'https://github.com/atlasclawbot97-cmyk/calculator',
      url: 'https://atlasclawbot97-cmyk.github.io/calculator/'
    },
    {
      id: 'app-stand-up',
      name: 'Stand Up Reminder',
      repo: 'https://github.com/atlasclawbot97-cmyk/stand-up-reminder',
      url: 'https://atlasclawbot97-cmyk.github.io/stand-up-reminder/'
    },
    {
      id: 'app-dashboard',
      name: 'Atlas Dashboard',
      repo: 'https://github.com/atlasclawbot97-cmyk/atlas-dashboard',
      url: 'https://atlas-dashboard-peach.vercel.app/'
    }
  ];

  const ideas = [
    {
      id: 'idea-1',
      title: 'Add timeline of recent actions to the dashboard',
      detail: 'Visual feed of what Atlas and the fleet did recently (deploys, edits, issues).'
    },
    {
      id: 'idea-2',
      title: 'Hook dashboard to real memory files',
      detail: 'Read MEMORY.md and daily logs to auto-populate tasks and notes.'
    },
    {
      id: 'idea-3',
      title: 'Separate views per agent role',
      detail: 'Filter dashboard by orchestrator / builder / observer to see focused views.'
    }
  ];

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [agentsRes, tasksRes] = await Promise.all([
          fetch('/api/agents'),
          fetch('/api/tasks')
        ]);

        if (!agentsRes.ok || !tasksRes.ok) throw new Error('API error');

        const agentsJson = await agentsRes.json();
        const tasksJson: Task[] = await tasksRes.json();

        if (!isMounted) return;

        setAgents(agentsJson);
        setTasks({
          inbox: tasksJson.filter(t => t.status === 'inbox'),
          doing: tasksJson.filter(t => t.status === 'doing'),
          done: tasksJson.filter(t => t.status === 'done')
        });
      } catch (e: any) {
        if (isMounted) setError(e.message || 'Failed to load');
      }
    };

    load();
    const interval = setInterval(load, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (error) {
    return (
      <div className="app-shell">
        <div className="card">
          <div className="card-title">Atlas Dashboard</div>
          <div className="list-meta">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">
          <span className="emoji">{atlas.emoji}</span>
          <span>{atlas.name} Dashboard</span>
        </div>
        <div className="app-meta">
          <div>{atlas.notes}</div>
          <div>Timezone: {atlas.timezone}</div>
        </div>
      </header>

      <Office agents={agents} />

      <section className="grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Atlas Status</div>
            <Badge status={atlas.status} />
          </div>
          <div className="kv">
            <strong>Mode:</strong> {atlas.mode}
          </div>
          <div className="kv">
            <strong>Context:</strong> Telegram session with Rayan
          </div>
          <div className="kv">
            <strong>Highlights:</strong>
          </div>
          <div className="chip-row">
            <span className="chip">Deployed click counter</span>
            <span className="chip">Deployed gradient calculator</span>
            <span className="chip">Deployed stand-up reminder</span>
            <span className="chip">GitHub + Pages automation</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Tasks</div>
            <span className="badge">Kanban snapshot</span>
          </div>
          <div className="columns-3">
            <TaskColumn title="Inbox" tasks={tasks.inbox} />
            <TaskColumn title="Doing" tasks={tasks.doing} />
            <TaskColumn title="Done" tasks={tasks.done} />
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Issues / Frictions</div>
            <span className="badge">Known bumps</span>
          </div>
          <IssuesList issues={issues} />
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Fleet & Apps</div>
            <span className="badge">Orchestrator + workers</span>
          </div>
          <div className="columns-3">
            <div>
              <div className="column-title">Agents</div>
              <AgentsList agents={agents} />
            </div>
            <div>
              <div className="column-title">Apps</div>
              <AppsList apps={apps} />
            </div>
            <div>
              <div className="column-title">Ideas / Backlog</div>
              <IdeasList ideas={ideas} />
            </div>
          </div>
        </div>
      </section>

      <div className="footer-note">v1.3 · Office view + fleet-aware dashboard with live polling via /api.</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Atlas Dashboard</title>
      </Head>
      <Dashboard />
    </>
  );
}
