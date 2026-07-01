interface SagaTagProps {
  label: string;
  color: string;
}

export default function SagaTag({ label, color }: SagaTagProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 10,
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: `color-mix(in srgb, ${color} 85%, transparent)`,
        border: `1px solid ${color}`,
        borderRadius: 3,
        padding: '2px 6px',
        lineHeight: 1.6,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
