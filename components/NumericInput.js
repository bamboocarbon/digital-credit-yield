'use client';

const MONO = { fontFamily: "'Roboto Mono', 'Courier New', monospace" };

export default function NumericInput({ value, onChange, step = 0.1, min, className, style, disabled, readOnly, 'aria-label': ariaLabel }) {
  function adj(delta) {
    const n = parseFloat(value) || 0;
    const next = parseFloat((n + delta).toFixed(10));
    const result = min !== undefined ? Math.max(min, next) : next;
    onChange(String(result));
  }

  // When read-only the value is derived elsewhere — drop the steppers and the space
  // they'd otherwise reserve so the figure sits centered like a normal display.
  const showSteppers = !readOnly;

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={ariaLabel}
        className={className}
        style={{
          ...MONO,
          ...style,
          paddingRight: showSteppers ? '22px' : undefined,
        }}
      />
      {showSteppers && (
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
      )}
    </div>
  );
}
