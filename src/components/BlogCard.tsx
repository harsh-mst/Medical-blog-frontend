import type { BlogPost } from '../types/blog';

const SPEC_LABELS: Record<string, string> = {
  general_practitioner: 'General Practice',
  cardiologist: 'Cardiology',
  neurologist: 'Neurology',
  pediatrician: 'Pediatrics',
  oncologist: 'Oncology',
  dermatologist: 'Dermatology',
  orthopedist: 'Orthopaedics',
  psychiatrist: 'Psychiatry',
  endocrinologist: 'Endocrinology',
  gastroenterologist: 'Gastroenterology',
  pulmonologist: 'Pulmonology',
  infectious_disease: 'Infectious Disease',
  emergency_medicine: 'Emergency Medicine',
};

const SPEC_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  psychiatrist:    { bg: 'hsl(270, 60%, 96%)', text: 'hsl(270, 60%, 40%)', border: 'hsl(270, 40%, 80%)' },
  cardiologist:    { bg: 'hsl(350, 60%, 96%)', text: 'hsl(350, 60%, 42%)', border: 'hsl(350, 40%, 82%)' },
  neurologist:     { bg: 'hsl(220, 60%, 96%)', text: 'hsl(220, 60%, 42%)', border: 'hsl(220, 40%, 82%)' },
  oncologist:      { bg: 'hsl(16, 60%, 96%)',  text: 'hsl(16, 65%, 40%)',  border: 'hsl(16, 40%, 80%)' },
  dermatologist:   { bg: 'hsl(30, 60%, 96%)',  text: 'hsl(30, 65%, 40%)',  border: 'hsl(30, 40%, 80%)' },
  default:         { bg: 'var(--color-primary-highlight)', text: 'var(--color-primary)', border: 'var(--color-primary-border)' },
};

function getSpecColor(spec: string) {
  return SPEC_COLORS[spec] ?? SPEC_COLORS.default;
}

/* Deterministic avatar colour from name/id */
function avatarHue(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff;
  return h % 360;
}

interface Props { blog: BlogPost; onClick: () => void; }

export function BlogCard({ blog, onClick }: Props) {
  const preview = blog.content
    .replace(/#+\s+[^\n]*/g, '')
    .replace(/\*+([^*]+)\*+/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 155);

  const date = new Date(blog.generatedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const specLabel = SPEC_LABELS[blog.specialization] ?? blog.specialization.replace(/_/g, ' ');
  const specColor = getSpecColor(blog.specialization);
  const hue = avatarHue(blog.specialization + blog.generatedAt);

  return (
    <article
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`Read article: ${blog.title}`}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        transition: 'box-shadow var(--transition-interactive), transform var(--transition-interactive), border-color var(--transition-interactive)',
        animation: 'fadeUp 400ms ease both',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = 'var(--shadow-md)';
        el.style.transform = 'translateY(-3px)';
        el.style.borderColor = 'var(--color-primary-border)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = 'none';
        el.style.transform = 'none';
        el.style.borderColor = 'var(--color-border)';
      }}
    >
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, hsl(${hue}, 55%, 55%), hsl(${(hue + 40) % 360}, 55%, 60%))`,
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
      }} />

      {/* Specialization tag + read time */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)', paddingTop: 'var(--space-3)' }}>
        <span style={{
          fontSize: 'var(--text-xs)', fontWeight: 600,
          color: specColor.text,
          background: specColor.bg,
          padding: '3px var(--space-3)',
          borderRadius: 'var(--radius-full)',
          border: `1px solid ${specColor.border}`,
          letterSpacing: '0.01em',
        }}>
          {specLabel}
        </span>
        <span style={{
          fontSize: 'var(--text-xs)', fontWeight: 500,
          color: 'var(--color-text-faint)',
          background: 'var(--color-surface-offset)',
          padding: '3px var(--space-3)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-divider)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
          {blog.estimatedReadTime} min read
        </span>
        <span style={{
          fontSize: 'var(--text-xs)', fontWeight: 500,
          color: 'var(--color-text-faint)',
          background: 'var(--color-surface-offset)',
          padding: '3px var(--space-3)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-divider)',
          textTransform: 'capitalize',
        }}>
          {blog.tone}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-lg)',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.015em',
        color: 'var(--color-text)',
        marginBottom: 'var(--space-3)',
      }}>
        {blog.title}
      </h3>

      {/* Preview excerpt */}
      <p style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-muted)',
        lineHeight: 1.75,
        marginBottom: 'var(--space-5)',
        flex: 1,
      }}>
        {preview}…
      </p>

      {/* Footer — Author row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'var(--space-4)',
        borderTop: '1px solid var(--color-divider)',
        gap: 'var(--space-2)',
      }}>
        {/* Avatar + Author info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{
            width: 28, height: 28,
            borderRadius: 'var(--radius-full)',
            background: `linear-gradient(135deg, hsl(${hue}, 55%, 60%), hsl(${(hue + 50) % 360}, 60%, 50%))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.2 }}>
              Dr. {specLabel}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-faint)', lineHeight: 1.2 }}>
              {date}
            </div>
          </div>
        </div>

        {/* Read more arrow */}
        <span style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 'var(--text-xs)', fontWeight: 600,
          color: 'var(--color-primary)',
        }}>
          Read
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </article>
  );
}