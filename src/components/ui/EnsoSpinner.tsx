// Ensō (円相) - The Zen circle, symbolizing enlightenment, the universe, and the void
// Used as a loading indicator that embodies Watts' philosophy

interface EnsoSpinnerProps {
  size?: number;
  className?: string;
}

export function EnsoSpinner({ size = 24, className = '' }: EnsoSpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Loading..."
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="enso-spinner"
        style={{
          // The imperfect circle - ensō is traditionally drawn in one stroke
          // with a slight opening representing the imperfection that allows for growth
          strokeDasharray: '283',
          strokeDashoffset: '283',
        }}
      />
    </svg>
  );
}

// Variant with the traditional "gap" in the circle
export function EnsoOpen({ size = 24, className = '' }: EnsoSpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      <path
        d="M 95 50 A 45 45 0 1 1 50 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="enso-spinner"
      />
    </svg>
  );
}
