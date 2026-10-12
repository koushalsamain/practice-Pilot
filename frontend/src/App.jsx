
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  ShieldAlert,
  Users,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Clock,
  Target,
  Handshake,
  Activity,
} from "lucide-react";

import "./App.css";

import { useState } from "react";

const stats = [
  {
    label: "Total Registrations",
    value: "320",
    target: "500 target",
    change: "+12.5%",
    up: true,
    icon: Users,
    color: "blue",
  },
  {
    label: "Sponsorship",
    value: "₹35,000",
    target: "₹50,000 target",
    change: "70% achieved",
    up: true,
    icon: Handshake,
    color: "purple",
  },
  {
    label: "Tasks Pending",
    value: "12",
    target: "4 overdue",
    change: "Needs attention",
    up: false,
    icon: CheckSquare,
    color: "orange",
  },
  {
    label: "Event Health",
    value: "76/100",
    target: "Good progress",
    change: "+5 points",
    up: true,
    icon: Activity,
    color: "green",
  },
];

const tasks = [
  {
    title: "Contact pending sponsors",
    owner: "Vanshika",
    priority: "Critical",
    status: "Pending",
    date: "Today",
  },
  {
    title: "Promote event registration",
    owner: "Saania",
    priority: "High",
    status: "In Progress",
    date: "Tomorrow",
  },
  {
    title: "Finalize event volunteers",
    owner: "Devdatt",
    priority: "Medium",
    status: "Pending",
    date: "Oct 14",
  },
];


function App() {
  const [eventDetails, setEventDetails] = useState({
    name: "",
    date: "",
    registrationTarget: 500,
    sponsorshipTarget: 50000,
  });

  const [showEventForm, setShowEventForm] = useState(false);

  return (
          
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">E</div>
          <div>
            <h2>EventPilot</h2>
            <p>EVENT COMMAND CENTRE</p>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          <a className="nav-item active" href="#dashboard">
            <LayoutDashboard size={19} />
            Dashboard
          </a>
          <a className="nav-item" href="#event">
            <CalendarDays size={19} />
            Event Blueprint
          </a>
          <a className="nav-item" href="#tasks">
            <CheckSquare size={19} />
            Task Centre
            <span className="nav-count">12</span>
          </a>
          <a className="nav-item" href="#risks">
            <ShieldAlert size={19} />
            Risk & Alerts
            <span className="alert-dot" />
          </a>
          <a className="nav-item" href="#team">
            <Users size={19} />
            Team
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <h3>EventPilot Intelligence</h3>
            <p>Turn event data into your next best action.</p>
            <a href="#risks">Explore insights →</a>
          </div>

          <a className="nav-item" href="#settings">
            <Settings size={19} />
            Settings
          </a>

          <div className="profile">
            <div className="avatar">K</div>
            <div>
              <strong>Event Organizer</strong>
              <p>Admin workspace</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>Dashboard</strong>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input placeholder="Search anything..." />
            </label>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <div className="avatar">K</div>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <div className="eyebrow">
              <span className="live-dot" />
              EVENT OVERVIEW
            </div>
            <h1>Your event, under control.</h1>
            <p>
              Track progress, identify risks and decide what needs attention
              next.
            </p>
          </div>
           <button
            className="primary-button"
            onClick={() => setShowEventForm(true)}
          >
            <Plus size={18} />
            Create Event
          </button>
        </section>

        <section className="event-banner" id="event">
          <div className="event-banner-content">
            <span className="event-tag">FEATURED EVENT</span>
            <h2>CodeX Campus Fest 2026</h2>
            <p>
              <CalendarDays size={16} />
              October 15, 2026
              <span className="banner-divider">•</span>
              <Users size={16} />
              College Event
            </p>
          </div>

          <div className="event-countdown">
            <span>EVENT STARTS IN</span>
            <strong>04 <small>DAYS</small></strong>
            <div className="countdown-line">
              <span />
            </div>
            <small>Preparation in progress</small>
          </div>
        </section>

        <section className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article className="stat-card" key={stat.label}>
                <div className="stat-card-top">
                  <span>{stat.label}</span>
                  <div className={`stat-icon ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                </div>

                <h2>{stat.value}</h2>

                <div className="stat-footer">
                  <span>{stat.target}</span>
                  <span className={stat.up ? "positive" : "warning"}>
                    {stat.up ? (
                      <ArrowUpRight size={15} />
                    ) : (
                      <ArrowDownRight size={15} />
                    )}
                    {stat.change}
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        <div className="dashboard-grid">
          <section className="panel progress-panel">
            <div className="panel-heading">
              <div>
                <h2>Event Goal Progress</h2>
                <p>Planned targets versus current results</p>
              </div>
              <button className="text-button">View details ↗</button>
            </div>

            <div className="goal-row">
              <div className="goal-title">
                <span className="goal-icon blue">
                  <Users size={18} />
                </span>
                <div>
                  <strong>Registrations</strong>
                  <p>320 of 500 participants</p>
                </div>
              </div>
              <strong>64%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill blue-fill" style={{ width: "64%" }} />
            </div>

            <div className="goal-row">
              <div className="goal-title">
                <span className="goal-icon purple">
                  <Handshake size={18} />
                </span>
                <div>
                  <strong>Sponsorship</strong>
                  <p>₹35,000 of ₹50,000</p>
                </div>
              </div>
              <strong>70%</strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill purple-fill"
                style={{ width: "70%" }}
              />
            </div>

            <div className="goal-row">
              <div className="goal-title">
                <span className="goal-icon green">
                  <Target size={18} />
                </span>
                <div>
                  <strong>Task Completion</strong>
                  <p>18 of 30 tasks completed</p>
                </div>
              </div>
              <strong>60%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill green-fill" style={{ width: "60%" }} />
            </div>
          </section>

          <section className="panel risk-panel" id="risks">
            <div className="panel-heading">
              <div>
                <h2>Priority Alerts</h2>
                <p>Issues that need attention first</p>
              </div>
              <span className="risk-count">2 ACTIVE</span>
            </div>

            <article className="risk-item critical-risk">
              <div className="risk-symbol">
                <ShieldAlert size={19} />
              </div>
              <div className="risk-details">
                <strong>Registration target at risk</strong>
                <p>180 more registrations are needed.</p>
                <span>Recommended: Increase outreach today.</span>
              </div>
            </article>

            <article className="risk-item warning-risk">
              <div className="risk-symbol">
                <Clock size={19} />
              </div>
              <div className="risk-details">
                <strong>Sponsorship gap detected</strong>
                <p>₹15,000 remains to reach the goal.</p>
                <span>Recommended: Follow up with sponsors.</span>
              </div>
            </article>

            <button className="secondary-button" onClick={() => window.location.hash = "tasks"}>
              Review action queue
            </button>
          </section>
        </div>

        <section className="panel tasks-panel" id="tasks">
          <div className="panel-heading">
            <div>
              <h2>Priority Action Queue</h2>
              <p>Recommended next actions for your team</p>
            </div>
            <button className="primary-button small-button">
              <Plus size={16} />
              Add Task
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>TASK</th>
                  <th>ASSIGNED TO</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                  <th>DUE DATE</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.title}>
                    <td>
                      <div className="task-name">
                        <span className="task-checkbox" />
                        {task.title}
                      </div>
                    </td>
                    <td>{task.owner}</td>
                    <td>
                      <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge">{task.status}</span>
                    </td>
                    <td>{task.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="footer">
          <span>EventPilot © 2026</span>
          <span>Plan smarter. Act faster. Run better events.</span>
        </footer>

      {showEventForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(3, 7, 18, 0.78)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEventDetails({
                ...eventDetails,
                name: e.currentTarget.eventName.value,
                date: e.currentTarget.eventDate.value,
                registrationTarget: Number(
                  e.currentTarget.registrationTarget.value
                ),
                sponsorshipTarget: Number(
                  e.currentTarget.sponsorshipTarget.value
                ),
              });
              setShowEventForm(false);
            }}
            style={{
              width: "100%",
              maxWidth: "520px",
              padding: "28px",
              borderRadius: "18px",
              background: "#111827",
              border: "1px solid #334155",
              color: "#f8fafc",
              display: "grid",
              gap: "16px",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 8px" }}>Create New Event</h2>
              <p style={{ color: "#94a3b8", margin: 0 }}>
                Set up your event operating plan.
              </p>
            </div>

            <label>
              Event Name
              <input
                name="eventName"
                defaultValue={eventDetails.name}
                placeholder="e.g. CodeX Campus Hackathon"
                required
                style={eventInputStyle}
              />
            </label>

            <label>
              Event Date
              <input
                name="eventDate"
                type="date"
                defaultValue={eventDetails.date}
                required
                style={eventInputStyle}
              />
            </label>

            <label>
              Registration Target
              <input
                name="registrationTarget"
                type="number"
                min="1"
                defaultValue={eventDetails.registrationTarget}
                required
                style={eventInputStyle}
              />
            </label>

            <label>
              Sponsorship Target (₹)
              <input
                name="sponsorshipTarget"
                type="number"
                min="0"
                defaultValue={eventDetails.sponsorshipTarget}
                required
                style={eventInputStyle}
              />
            </label>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" className="primary-button">
                Create Event
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowEventForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      </main>
    </div>
  );
}

export default App;
