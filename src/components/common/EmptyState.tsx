interface EmptyStateProps {
  icon?: string;
  message: string;
}

export default function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      {icon && (
        <span
          style={{ fontSize: 32, lineHeight: 1, opacity: 0.5 }}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <p
        style={{
          margin: 0,
          fontSize: 14,
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-dim)',
          lineHeight: 1.6,
          maxWidth: '36ch',
        }}
      >
        {message}
      </p>
    </div>
  );
}
