type Size = 'sm' | 'md' | 'lg';

interface HouseInitialProps {
  initial: string;
  accent: string;
  c1: string;
  size?: Size;
}

const SIZE_MAP: Record<Size, number> = {
  sm: 32,
  md: 44,
  lg: 56,
};

const FONT_SIZE_MAP: Record<Size, number> = {
  sm: 13,
  md: 18,
  lg: 23,
};

export default function HouseInitial({ initial, accent, c1, size = 'md' }: HouseInitialProps) {
  const px = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: px,
        height: px,
        minWidth: px,
        background: c1,
        border: `1px solid ${accent}`,
        borderRadius: 2,
        color: accent,
        fontFamily: 'var(--font-cinzel)',
        fontWeight: 700,
        fontSize,
        lineHeight: 1,
        userSelect: 'none',
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {initial.charAt(0).toUpperCase()}
    </span>
  );
}
