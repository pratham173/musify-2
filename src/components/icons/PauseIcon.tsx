export const PauseIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
      fill="currentColor"
    />
  </svg>
);
