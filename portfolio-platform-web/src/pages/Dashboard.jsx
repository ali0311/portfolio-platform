import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import styles from "./Dashboard.module.css";

const EMPTY_OVERVIEW = {
  totalVisitors: 0,
  uniqueVisitors: 0,
  resumeDownloads: 0,
  contactMessages: 0,
};

function timeAgo(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

const PIE_COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#a78bfa", "#c4b5fd"];

const tooltipStyle = {
  background: "#11111f",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  fontSize: 12,
  padding: "8px 12px",
};

const axisStyle = { fill: "#7a7a90", fontSize: 11 };

function formatNumber(n) {
  return n.toLocaleString();
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState(EMPTY_OVERVIEW);
  const [trend, setTrend] = useState([]);
  const [topSections, setTopSections] = useState([]);
  const [devices, setDevices] = useState([]);
  const [browsers, setBrowsers] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [ov, tr, ts, dev, rv, msg] = await Promise.all([
          api.get("/api/dashboard/overview"),
          api.get("/api/dashboard/visitor-trend"),
          api.get("/api/dashboard/top-sections"),
          api.get("/api/dashboard/devices"),
          api.get("/api/dashboard/recent-visitors"),
          api.get("/api/dashboard/contact-messages"),
        ]);
        if (cancelled) return;
        setOverview(ov);
        setTrend(tr);
        setTopSections(ts.map((s) => ({ section: s.section, views: s.count })));
        setDevices(dev.devices.map((d) => ({ name: d.device, value: d.count })));
        setBrowsers(dev.browsers.map((b) => ({ name: b.browser, value: b.count })));
        setRecentVisitors(rv);
        setMessages(msg);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onLogout() {
    await logout();
    navigate("/");
  }

  if (loading) {
    return (
      <div className="container">
        <div className={styles.dashboard}>
          <div className={styles.loadingState}>
            <Loader2 size={20} className="animate-spin" />
            <span>Loading dashboard…</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.dashboard}>
          <div className={styles.errorState}>
            <p>{error}</p>
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.dashboard}>
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              {user?.email
                ? `Signed in as ${user.email}`
                : "Visitor analytics & engagement overview"}
            </p>
          </div>
          <button type="button" className={styles.logoutBtn} onClick={onLogout}>
            <LogOut size={14} />
            Sign out
          </button>
        </div>

        <div className={styles.kpis}>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Total Visitors</div>
            <div className={styles.kpiValue}>{formatNumber(overview.totalVisitors)}</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Unique Visitors</div>
            <div className={styles.kpiValue}>{formatNumber(overview.uniqueVisitors)}</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Resume Downloads</div>
            <div className={styles.kpiValue}>{formatNumber(overview.resumeDownloads)}</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Contact Requests</div>
            <div className={styles.kpiValue}>{formatNumber(overview.contactMessages)}</div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Visitor Trend</span>
              <span className={styles.panelSub}>Last 7 days</span>
            </div>
            <div className={styles.chartHost}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="uniGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#visGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="unique"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#uniGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Top Viewed Sections</span>
              <span className={styles.panelSub}>All time</span>
            </div>
            <div className={styles.chartHost}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSections} layout="vertical">
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="section"
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="views"
                    fill="#8b5cf6"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className={styles.row3}>
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Devices</span>
              <span className={styles.panelSub}>Share %</span>
            </div>
            <div className={styles.chartHostSm}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devices}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                  >
                    {devices.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, color: "#b8b8c8" }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Browsers</span>
              <span className={styles.panelSub}>Share %</span>
            </div>
            <div className={styles.chartHostSm}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={browsers}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                  >
                    {browsers.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, color: "#b8b8c8" }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Recent Visitors</span>
              <span className={styles.panelSub}>Live</span>
            </div>
            <div className={styles.list}>
              {recentVisitors.length === 0 && (
                <div className={styles.emptyState}>No visitors yet</div>
              )}
              {recentVisitors.map((v) => (
                <div key={v.id} className={styles.listRow}>
                  <div className={styles.listMain}>
                    <span className={styles.listMainTop}>{v.country || "Unknown"}</span>
                    <span className={styles.listMainSub}>
                      {v.deviceType || "—"} · {v.browser || "—"} · {v.visitedPage || "/"}
                    </span>
                  </div>
                  <span className={styles.listSide}>{timeAgo(v.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>Contact Messages</span>
            <span className={styles.panelSub}>Latest submissions</span>
          </div>
          <div className={styles.list}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>No contact messages yet</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={styles.message}>
                <div className={styles.messageHead}>
                  <span className={styles.messageName}>
                    {m.linkedinUrl || "Anonymous"}
                  </span>
                  <span className={styles.listSide}>{timeAgo(m.createdAt)}</span>
                </div>
                <p className={styles.messageBody}>{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
