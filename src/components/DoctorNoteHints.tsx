const HINTS = [
  {
    label: 'Your specialty',
    icon: '🩺',
    examples: ["I'm a cardiologist", 'I work in emergency medicine', 'I specialise in paediatric oncology'],
  },
  {
    label: "Who you're writing for",
    icon: '👥',
    examples: ['for my patients', 'for fellow clinicians', 'for general public or caregivers'],
  },
  {
    label: 'Tone or feel',
    icon: '🎙️',
    examples: ['warm and empathetic', 'straightforward and factual', 'educational, like a guide'],
  },
  {
    label: 'Length you want',
    icon: '📏',
    examples: ['short ~400 words', 'medium ~700 words', 'detailed ~1500 words'],
  },
  {
    label: 'Your clinical angle',
    icon: '🔬',
    examples: ['focus on prevention', 'cover emotional aspects too', 'based on 10 years in ICU'],
  },
];

const EXAMPLE =
  "I'm a neurologist with 8 years of experience. Writing for patients in simple language. Warm and empathetic tone, around 800 words. Focus on early warning signs people usually ignore.";

export function DoctorNoteHints() {
  return (
    <div style={{
      background: 'var(--color-surface-2)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      marginTop: 'var(--space-3)',
      animation: 'fadeIn 200ms ease',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        marginBottom: 'var(--space-4)',
      }}>
        <div style={{
          width: 22, height: 22,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-primary-highlight)',
          border: '1px solid var(--color-primary-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <p style={{
          fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}>
          Tips for a richer article
        </p>
      </div>

      {/* Hint grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {HINTS.map(h => (
          <div key={h.label} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.95rem', flexShrink: 0, marginTop: 1 }}>{h.icon}</span>
            <div style={{ flex: 1 }}>
              <span style={{
                display: 'block',
                fontSize: 'var(--text-xs)', fontWeight: 700,
                color: 'var(--color-text)',
                marginBottom: 'var(--space-2)',
                letterSpacing: '0.01em',
              }}>
                {h.label}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                {h.examples.map(ex => (
                  <span key={ex} style={{
                    fontSize: 'var(--text-xs)', fontWeight: 500,
                    color: 'var(--color-primary)',
                    background: 'var(--color-primary-highlight)',
                    border: '1px solid var(--color-primary-border)',
                    padding: '2px var(--space-2)',
                    borderRadius: 'var(--radius-full)',
                    lineHeight: 1.5,
                  }}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Example block */}
      <div style={{
        marginTop: 'var(--space-5)',
        paddingTop: 'var(--space-4)',
        borderTop: '1px solid var(--color-divider)',
      }}>
        <p style={{
          fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.05em', textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-3)',
        }}>
          Example Context
        </p>
        <blockquote style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-sm)',
          fontStyle: 'italic',
          color: 'var(--color-text)',
          background: 'var(--color-surface)',
          borderLeft: '3px solid var(--color-primary)',
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          padding: 'var(--space-3) var(--space-4)',
          lineHeight: 1.75,
          margin: 0,
          boxShadow: 'var(--shadow-xs)',
        }}>
          "{EXAMPLE}"
        </blockquote>
        <p style={{
          fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)',
          marginTop: 'var(--space-2)', fontStyle: 'italic',
          lineHeight: 1.6,
        }}>
          All of the above is optional — more detail helps the AI sound like you.
        </p>
      </div>
    </div>
  );
}