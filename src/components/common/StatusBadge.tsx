interface StatusBadgeProps {
  label: string;
  color: string;
}

export default function StatusBadge({ label, color }: StatusBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 10,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color,
        border: `1px solid ${color}`,
        borderRadius: 10,
        padding: '2px 8px',
        lineHeight: 1.6,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
