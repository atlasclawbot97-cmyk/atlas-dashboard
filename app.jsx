const { useEffect, useState } = React;

function Badge({ status }) {
  const labels = {
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

function TaskColumn({ title, tasks }) {
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
              {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function IssuesList({ issues }) {
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

function AgentsList({ agents }) {
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

function AppsList({ apps }) {
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

function IdeasList({ ideas }) {
  if (!ideas.length) return <div className="list-meta">No ideas yet.</div>;
  return (
    <div className="list">
      {ideas.map((idea) => (
        <div key={idea.id} className="list-item">
          <div className="list-label">{idea.title}</div>
          <div className="list-meta">{idea.detail}</div>
        </div>
      ))}
    </div>
  );
}

function Office({ agents }) {
  if (!agents.length) return null;

  const emojiForKind = (kind, name) => {
    if (name.toLowerCase().includes('atlas')) return '🌍';
    if (kind === 'orchestrator') return '🎛️';
    if (kind === 'worker') return '🛠️';
    if (kind === 'observer') return '👁️';
    if (kind === 'canary') return '🧪';
    return '🤖';
  };

  const labelForActivity = (activity) => {
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
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadOnce = () => {
      fetch('data.json?ts=' + Date.now())
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load data.json');
          return res.json();
        })
        .then((json) => {
          if (isMounted) setData(json);
        })
        .catch((err) => {
          if (isMounted) setError(err.message);
        });
    };

    loadOnce();

    const interval = setInterval(loadOnce, 15000); // poll every 15s

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

  if (!data) {
    return (
      <div className="app-shell">
        <div className="card">
          <div className="card-title">Atlas Dashboard</div>
          <div className="list-meta">Loading configuration...</div>
        </div>
      </div>
    );
  }

  const { atlas, tasks, issues, agents, apps, ideas } = data;

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

      <div className="footer-note">v1.3 · Office view + fleet-aware dashboard with live polling.</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Dashboard />);
