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
import { LogOut, Loader2, Smartphone, Monitor, Tablet, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import { flagFor } from "../utils/countryFlag";
import styles from "./Dashboard.module.css";

function DeviceIcon({ type }) {
  const size = 14;
  if (type === "mobile") return <Smartphone size={size} />;
  if (type === "tablet") return <Tablet size={size} />;
  if (type === "desktop") return <Monitor size={size} />;
  return null;
}

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

const PIE_COLORS = ["#8b5cf6", "#22d3ee", "#f97316", "#10b981", "#f43f5e", "#eab308", "#3b82f6", "#ec4899"];
const BAR_COLORS = ["#8b5cf6", "#22d3ee", "#f97316", "#10b981", "#f43f5e", "#eab308", "#3b82f6", "#ec4899", "#a78bfa", "#14b8a6"];

const tooltipStyle = {
  background: "#11111f",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  fontSize: 12,
  padding: "8px 12px",
};

const tooltipLabelStyle = { color: "#e5e7eb", fontWeight: 600 };
const tooltipItemStyle = { color: "#e5e7eb" };

const axisStyle = { fill: "#7a7a90", fontSize: 11 };

function barChartHeight(rowCount) {
  return Math.max(240, rowCount * 28);
}

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
  const [countries, setCountries] = useState([]);
  const [armedMessageId, setArmedMessageId] = useState(null);

  async function onDeleteMessage(id) {
    if (armedMessageId !== id) {
      setArmedMessageId(id);
      setTimeout(() => {
        setArmedMessageId((current) => (current === id ? null : current));
      }, 3000);
      return;
    }
    const prev = messages;
    setMessages((list) => list.filter((m) => m.id !== id));
    setArmedMessageId(null);
    try {
      await api.delete(`/api/dashboard/contact-messages/${id}`);
    } catch (err) {
      setMessages(prev);
      setError(err?.message || "Failed to delete message");
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [ov, tr, ts, dev, rv, msg, ctry] = await Promise.all([
          api.get("/api/dashboard/overview"),
          api.get("/api/dashboard/visitor-trend"),
          api.get("/api/dashboard/top-sections"),
          api.get("/api/dashboard/devices"),
          api.get("/api/dashboard/recent-visitors"),
          api.get("/api/dashboard/contact-messages"),
          api.get("/api/dashboard/countries"),
        ]);
        if (cancelled) return;
        setOverview(ov);
        setTrend(tr);
        setTopSections(ts.map((s) => ({ section: s.section, views: s.count })));
        setDevices(dev.devices.map((d) => ({ name: d.device, value: d.count })));
        setBrowsers(dev.browsers.map((b) => ({ name: b.browser, value: b.count })));
        setRecentVisitors(rv);
        setMessages(msg);
        setCountries(ctry.map((c) => ({ country: c.country, count: c.count })));
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
            <div className={styles.chartHost} style={{ height: barChartHeight(topSections.length) }}>
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
                    interval={0}
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
          <div className={styles.row3Left}>
            <div className={styles.row3Pies}>
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
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <span className={styles.panelTitle}>Countries</span>
                <span className={styles.panelSub}>Where visitors are from</span>
              </div>
              <div className={styles.chartHost} style={{ height: barChartHeight(countries.length) }}>
                {countries.length === 0 ? (
                  <div className={styles.emptyState}>No country data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countries} layout="vertical">
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="country"
                        tick={axisStyle}
                        axisLine={false}
                        tickLine={false}
                        width={110}
                        interval={0}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        labelStyle={tooltipLabelStyle}
                        itemStyle={tooltipItemStyle}
                      />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {countries.map((_, i) => (
                          <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
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
              {recentVisitors.map((v) => {
                const flag = flagFor(v.country);
                const deviceParts = [v.deviceType, v.browser].filter(Boolean);
                return (
                  <div key={v.id} className={styles.listRow}>
                    <div className={styles.listMain}>
                      {v.country && (
                        <span className={styles.listMainTop}>
                          {flag && <span className={styles.flag}>{flag}</span>}
                          {v.country}
                        </span>
                      )}
                      {deviceParts.length > 0 && (
                        <span className={styles.listMainSub}>
                          <DeviceIcon type={v.deviceType} />
                          {deviceParts.join(" · ")}
                        </span>
                      )}
                    </div>
                    <span className={styles.listSide}>{timeAgo(v.createdAt)}</span>
                  </div>
                );
              })}
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
            {messages.map((m) => {
              const armed = armedMessageId === m.id;
              return (
                <div key={m.id} className={styles.message}>
                  <div className={styles.messageHead}>
                    <span className={styles.messageName}>
                      {m.linkedinUrl || "Anonymous"}
                    </span>
                    <div className={styles.messageHeadRight}>
                      <span className={styles.listSide}>{timeAgo(m.createdAt)}</span>
                      <button
                        type="button"
                        className={armed ? styles.deleteBtnArmed : styles.deleteBtn}
                        onClick={() => onDeleteMessage(m.id)}
                        title={armed ? "Click again to confirm" : "Delete message"}
                      >
                        {armed ? "Sure?" : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>
                  <p className={styles.messageBody}>{m.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
