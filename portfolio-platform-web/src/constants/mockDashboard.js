export const mockOverview = {
  totalVisitors: 4327,
  uniqueVisitors: 2891,
  resumeDownloads: 184,
  contactRequests: 27,
};

export const mockVisitorTrend = [
  { day: "Mon", visitors: 120, unique: 84 },
  { day: "Tue", visitors: 168, unique: 110 },
  { day: "Wed", visitors: 142, unique: 96 },
  { day: "Thu", visitors: 198, unique: 132 },
  { day: "Fri", visitors: 247, unique: 165 },
  { day: "Sat", visitors: 184, unique: 121 },
  { day: "Sun", visitors: 156, unique: 105 },
];

export const mockTopSections = [
  { section: "Hero", views: 4127 },
  { section: "Experience", views: 3284 },
  { section: "Skills", views: 2790 },
  { section: "DevOps", views: 2412 },
  { section: "AI Work", views: 2104 },
  { section: "Domains", views: 1892 },
];

export const mockDevices = [
  { name: "Desktop", value: 62 },
  { name: "Mobile", value: 31 },
  { name: "Tablet", value: 7 },
];

export const mockBrowsers = [
  { name: "Chrome", value: 58 },
  { name: "Safari", value: 22 },
  { name: "Firefox", value: 9 },
  { name: "Edge", value: 8 },
  { name: "Other", value: 3 },
];

export const mockRecentVisitors = [
  { id: 1, country: "United States", device: "Desktop", browser: "Chrome", page: "/", at: "2m ago" },
  { id: 2, country: "Germany", device: "Mobile", browser: "Safari", page: "/#experience", at: "8m ago" },
  { id: 3, country: "India", device: "Desktop", browser: "Firefox", page: "/#skills", at: "14m ago" },
  { id: 4, country: "United Kingdom", device: "Mobile", browser: "Chrome", page: "/#devops", at: "21m ago" },
  { id: 5, country: "Canada", device: "Desktop", browser: "Edge", page: "/#ai-work", at: "33m ago" },
];

export const mockMessages = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    message: "Hi Ali, we're hiring senior SDETs and your DevOps work caught my eye. Open to chat?",
    at: "1h ago",
  },
  {
    id: 2,
    name: "Marcus Patel",
    email: "marcus@startup.io",
    message: "Loved the self-healing ETL writeup. Could you share a bit more about how you handle schema drift?",
    at: "Yesterday",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "e.rodriguez@firm.com",
    message: "Reaching out about a contract opportunity for a frontend + automation hybrid role.",
    at: "3 days ago",
  },
];
