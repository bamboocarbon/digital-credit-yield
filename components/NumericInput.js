'use client';

const MONO = { fontFamily: "'Roboto Mono', 'Courier New', monospace" };

export default function NumericInput({ value, onChange, step = 0.1, min, className, style, disabled, 'aria-label': ariaLabel }) {
  function adj(delta) {
    const n = parseFloat(value) || 0;
    const next = parseFloat((n + delta).toFixed(10));
    const result = min !== undefined ? Math.max(min, next) : next;
    onChange(String(result));
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        className={className}
        style={{
          ...MONO,
          ...style,
          paddingRight: '22px',
        }}
      />
      <div style={{
        position: 'absolute', right: 3, top: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        gap: 1, pointerEvents: disabled ? 'none' : 'auto',
      }}>
        <button type="button" tabIndex={-1} onClick={() => adj(step)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 8, lineHeight: 1, padding: '1px 2px' }}>
          ▲
        </button>
        <button type="button" tabIndex={-1} onClick={() => adj(-step)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 8, lineHeight: 1, padding: '1px 2px' }}>
          ▼
        </button>
      </div>
    </div>
  );
}
