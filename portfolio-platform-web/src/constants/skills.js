export const skillCategories = [
  {
    id: "core-qa",
    label: "Core QA",
    items: [
      { name: "Test Strategy", level: 95 },
      { name: "Automation Architecture", level: 92 },
      { name: "API Testing", level: 90 },
      { name: "Selenium (C# / Java)", level: 88 },
      { name: "BDD Frameworks", level: 85 },
      { name: "Playwright", level: 80 },
      { name: "WebdriverIO", level: 80 },
      { name: "pytest", level: 78 },
      { name: "Performance Testing", level: 70 },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: [
      { name: "JavaScript", level: 70 },
      { name: "HTML & CSS", level: 65 },
      { name: "React", level: 60 },
      { name: "Component Design", level: 50 },
    ],
  },
  {
    id: "backend",
    label: "Backend (Basics)",
    items: [
      { name: "REST APIs", level: 50 },
      { name: "Node.js", level: 40 },
      { name: "PostgreSQL", level: 40 },
      { name: "Express", level: 35 },
    ],
  },
  {
    id: "data-eng",
    label: "Data Engineering",
    items: [
      { name: "Medallion Architecture (Bronze / Silver / Gold)", level: 85 },
      { name: "ETL Testing with PySpark", level: 85 },
      { name: "Data Pipeline & Schema Validation", level: 82 },
      { name: "Data Quality Monitoring (Splunk + Teams)", level: 80 },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    items: [
      { name: "Jenkins", level: 88 },
      { name: "Git", level: 92 },
      { name: "GitHub Actions", level: 85 },
      { name: "Docker", level: 82 },
      { name: "ReportPortal", level: 78 },
      { name: "SonarQube", level: 75 },
      { name: "Splunk / Grafana", level: 75 },
      { name: "Linux", level: 75 },
      { name: "ZAP (DAST)", level: 70 },
      { name: "Nginx", level: 65 },
    ],
  },
  {
    id: "cloud",
    label: "Cloud",
    items: [
      { name: "AWS EC2", level: 65 },
      { name: "AWS S3 + CloudFront", level: 65 },
      { name: "CloudWatch", level: 60 },
      { name: "IAM", level: 55 },
    ],
  },
  {
    id: "tools",
    label: "AI & Tools",
    items: [
      { name: "GitHub Copilot", level: 88 },
      { name: "Claude in VSCode", level: 88 },
      { name: "MCP Servers", level: 80 },
      { name: "Copilot SDK", level: 60 },
    ],
  },
];

export const radarSnapshot = [
  { axis: "QA", value: 95 },
  { axis: "Automation", value: 92 },
  { axis: "DevOps", value: 82 },
  { axis: "Data Eng", value: 83 },
  { axis: "AI Tools", value: 90 },
  { axis: "Frontend", value: 75 },
  { axis: "Cloud", value: 62 },
];
