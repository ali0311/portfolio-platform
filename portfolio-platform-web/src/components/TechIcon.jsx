const ICONS = {
  react: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="2.5" fill="#61DAFB" />
      <g fill="none" stroke="#61DAFB" strokeWidth="1.5">
        <ellipse cx="16" cy="16" rx="11" ry="4.2" />
        <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(120 16 16)" />
      </g>
    </svg>
  ),
  docker: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <g fill="#2496ED">
        <rect x="6" y="14" width="3.5" height="3.5" rx="0.4" />
        <rect x="10" y="14" width="3.5" height="3.5" rx="0.4" />
        <rect x="14" y="14" width="3.5" height="3.5" rx="0.4" />
        <rect x="18" y="14" width="3.5" height="3.5" rx="0.4" />
        <rect x="10" y="10" width="3.5" height="3.5" rx="0.4" />
        <rect x="14" y="10" width="3.5" height="3.5" rx="0.4" />
        <rect x="14" y="6" width="3.5" height="3.5" rx="0.4" />
        <path d="M22 16 C25 13, 27 16, 27 18 C24 20, 21 19, 22 16Z" />
      </g>
    </svg>
  ),
  kubernetes: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <polygon
        points="16,3 27,9 27,23 16,29 5,23 5,9"
        fill="none"
        stroke="#326CE5"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3" fill="#326CE5" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        fill="#f5f5fa"
        d="M16 3a13 13 0 0 0-4.1 25.3c.65.12.89-.28.89-.62v-2.4c-3.62.79-4.38-1.55-4.38-1.55-.59-1.5-1.44-1.9-1.44-1.9-1.18-.81.09-.79.09-.79 1.3.09 1.99 1.34 1.99 1.34 1.16 1.98 3.04 1.41 3.78 1.08.12-.84.45-1.41.82-1.74-2.89-.33-5.93-1.45-5.93-6.45 0-1.42.51-2.59 1.34-3.5-.13-.33-.58-1.65.13-3.44 0 0 1.09-.35 3.58 1.34a12.4 12.4 0 0 1 6.51 0c2.49-1.69 3.58-1.34 3.58-1.34.71 1.79.26 3.11.13 3.44.83.91 1.34 2.08 1.34 3.5 0 5.01-3.05 6.12-5.95 6.44.46.4.88 1.18.88 2.39v3.55c0 .35.24.75.9.62A13 13 0 0 0 16 3Z"
      />
    </svg>
  ),
  aws: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <text
        x="16"
        y="20"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="9"
        fontWeight="800"
        fill="#FF9900"
      >
        aws
      </text>
      <path
        d="M5 23 C12 26, 20 26, 27 23"
        fill="none"
        stroke="#FF9900"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="4" fill="#F7DF1E" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="13"
        fontWeight="800"
        fill="#0a0a16"
      >
        JS
      </text>
    </svg>
  ),
};

export default function TechIcon({ name, size = 28, className }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <span
      className={className}
      style={{ width: size, height: size, display: "inline-block" }}
      aria-label={name}
    >
      {icon}
    </span>
  );
}
