interface SectionTitleProps {
  kicker?: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ kicker, title, subtitle }: SectionTitleProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {kicker && (
        <span
          style={{
            display: 'block',
            fontSize: 11,
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-dim)',
          }}
        >
          {kicker}
        </span>
      )}

      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-cinzel)',
          fontWeight: 700,
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          lineHeight: 1.15,
          color: 'var(--color-text)',
          textWrap: 'balance',
        }}
      >
        {title}
      </h2>

      <div
        style={{
          width: 80,
          height: 1,
          background: 'var(--color-gold)',
          opacity: 0.5,
          flexShrink: 0,
        }}
        aria-hidden="true"
      />

      {subtitle && (
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            maxWidth: '52ch',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
