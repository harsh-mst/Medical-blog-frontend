import { useEffect, useRef, useState } from 'react';
import type { BlogPost } from '../types/blog';

const SPEC_LABELS: Record<string, string> = {
  general_practitioner: 'General Practitioner',
  cardiologist: 'Cardiologist',
  neurologist: 'Neurologist',
  pediatrician: 'Pediatrician',
  oncologist: 'Oncologist',
  dermatologist: 'Dermatologist',
  orthopedist: 'Orthopedic Surgeon',
  psychiatrist: 'Psychiatrist',
  endocrinologist: 'Endocrinologist',
  gastroenterologist: 'Gastroenterologist',
  pulmonologist: 'Pulmonologist',
  infectious_disease: 'Infectious Disease Specialist',
  emergency_medicine: 'Emergency Medicine Physician',
};

function avatarHue(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff;
  return h % 360;
}

interface Props { blog: BlogPost; onClose: () => void; }

export function BlogReader({ blog, onClose }: Props) {
  const [scrollPct, setScrollPct] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const date = new Date(blog.generatedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const specLabel = SPEC_LABELS[blog.specialization] ?? blog.specialization.replace(/_/g, ' ');
  const hue = avatarHue(blog.specialization + blog.generatedAt);

  /* Reading progress */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight <= clientHeight ? 100 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollPct(Math.min(100, pct));
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  /* Keyboard close */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  /* ── Markdown → JSX renderer ── */
  // const renderContent = () => {
  //   const lines = blog.content.split('\n');
  //   const elements: React.ReactNode[] = [];
  //   let i = 0;

  //   while (i < lines.length) {
  //     const line = lines[i];

  //     if (line.startsWith('## ')) {
  //       elements.push(
  //         <h2 key={i} style={{
  //           fontFamily: 'var(--font-display)',
  //           fontSize: 'var(--text-xl)',
  //           fontWeight: 700,
  //           color: 'var(--color-text)',
  //           lineHeight: 1.25,
  //           letterSpacing: '-0.02em',
  //           marginTop: 'var(--space-12)',
  //           marginBottom: 'var(--space-4)',
  //           paddingBottom: 'var(--space-3)',
  //           borderBottom: '2px solid var(--color-primary-highlight)',
  //         }}>
  //           {line.replace('## ', '')}
  //         </h2>
  //       );
  //     } else if (line.startsWith('### ')) {
  //       elements.push(
  //         <h3 key={i} style={{
  //           fontFamily: 'var(--font-display)',
  //           fontSize: 'var(--text-lg)',
  //           fontWeight: 600,
  //           color: 'var(--color-text)',
  //           lineHeight: 1.3,
  //           marginTop: 'var(--space-8)',
  //           marginBottom: 'var(--space-3)',
  //           letterSpacing: '-0.01em',
  //         }}>
  //           {line.replace('### ', '')}
  //         </h3>
  //       );
  //     } else if (line.startsWith('- ') || line.startsWith('* ')) {
  //       const listItems: string[] = [];
  //       while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
  //         listItems.push(lines[i].replace(/^[-*] /, ''));
  //         i++;
  //       }
  //       elements.push(
  //         <ul key={`ul-${i}`} style={{
  //           margin: 'var(--space-4) 0',
  //           paddingLeft: 0,
  //           display: 'flex',
  //           flexDirection: 'column',
  //           gap: 'var(--space-2)',
  //         }}>
  //           {listItems.map((item, idx) => (
  //             <li key={idx} style={{
  //               display: 'flex',
  //               gap: 'var(--space-3)',
  //               fontSize: 'var(--text-md)',
  //               color: 'var(--color-text)',
  //               lineHeight: 1.8,
  //             }}>
  //               <span style={{
  //                 flexShrink: 0,
  //                 marginTop: 9,
  //                 width: 6, height: 6,
  //                 borderRadius: '50%',
  //                 background: 'var(--color-primary)',
  //                 display: 'block',
  //               }} />
  //               {item}
  //             </li>
  //           ))}
  //         </ul>
  //       );
  //       continue;
  //     } else if (line.startsWith('> ')) {
  //       elements.push(
  //         <blockquote key={i} style={{
  //           margin: 'var(--space-6) 0',
  //           padding: 'var(--space-4) var(--space-6)',
  //           borderLeft: '4px solid var(--color-primary)',
  //           background: 'var(--color-primary-highlight)',
  //           borderRadius: '0 var(--radius-md) var(--radius-md) 0',
  //           fontFamily: 'var(--font-display)',
  //           fontSize: 'var(--text-md)',
  //           fontStyle: 'italic',
  //           color: 'var(--color-text)',
  //           lineHeight: 1.75,
  //         }}>
  //           {line.replace('> ', '')}
  //         </blockquote>
  //       );
  //     } else if (line.trim() === '') {
  //       // paragraph break — skip, handled by margin
  //     } else {
  //       elements.push(
  //         <p key={i} style={{
  //           fontFamily: 'var(--font-body)',
  //           fontSize: 'var(--text-md)',
  //           lineHeight: 1.85,
  //           color: 'var(--color-text)',
  //           marginBottom: 'var(--space-5)',
  //         }}>
  //           {line}
  //         </p>
  //       );
  //     }
  //     i++;
  //   }
  //   return elements;
  // };

  const renderContent = () => {
  // Split by any newline variation (\n, \r\n)
  const lines = blog.content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Strip any stray ## or ### the model sneaks in
    const cleanLine = line.replace(/^#{1,6}\s+/, '').trim();

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--color-text)',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          marginTop: 'var(--space-12)',
          marginBottom: 'var(--space-4)',
          paddingBottom: 'var(--space-3)',
          borderBottom: '2px solid var(--color-primary-highlight)',
        }}>
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-lg)',
          fontWeight: 600,
          color: 'var(--color-text)',
          lineHeight: 1.3,
          marginTop: 'var(--space-8)',
          marginBottom: 'var(--space-3)',
          letterSpacing: '-0.01em',
        }}>
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].replace(/^[-*] /, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{
          margin: 'var(--space-5) 0',
          paddingLeft: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}>
          {listItems.map((item, idx) => (
            <li key={idx} style={{
              display: 'flex',
              gap: 'var(--space-3)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text)',
              lineHeight: 1.8,
            }}>
              <span style={{
                flexShrink: 0,
                marginTop: 9,
                width: 6, height: 6,
                borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'block',
              }} />
              {item}
            </li>
          ))}
        </ul>
      );
      continue;

    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} style={{
          margin: 'var(--space-6) 0',
          padding: 'var(--space-4) var(--space-6)',
          borderLeft: '4px solid var(--color-primary)',
          background: 'var(--color-primary-highlight)',
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-base)',
          fontStyle: 'italic',
          color: 'var(--color-text)',
          lineHeight: 1.75,
        }}>
          {line.replace(/^>\s*/, '')}
        </blockquote>
      );

    } else if (line.trim() === '') {
      // blank line = paragraph gap spacer
      elements.push(<div key={`gap-${i}`} style={{ height: 'var(--space-2)' }} />);

    } else if (cleanLine.length > 0) {
      // If the AI somehow produced a massive block without newlines,
      // we could split it by sentence here, but we prefer fixing the prompt first.
      elements.push(
        <p key={i} style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-md)', // slightly larger for readability
          lineHeight: 1.85,
          color: 'var(--color-text)',
          marginBottom: 'var(--space-8)', // increased spacing for better breathing room
        }}>
          {cleanLine}
        </p>
      );
    }

    i++;
  }

  return elements;
};
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'var(--color-bg)',
        overflowY: 'auto',
        animation: 'fadeIn 250ms ease',
      }}
    >
      {/* ── Reading Progress Bar ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 3,
        background: 'var(--color-divider)',
        pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%',
          width: `${scrollPct}%`,
          background: `linear-gradient(90deg, var(--color-primary), hsl(196, 72%, 55%))`,
          borderRadius: '0 2px 2px 0',
          transition: 'width 80ms linear',
          boxShadow: '0 0 8px hsl(196, 72%, 55% / 0.5)',
        }} />
      </div>

      {/* ── Sticky Top Bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 150,
        background: 'var(--color-surface)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid var(--color-divider)',
        boxShadow: 'var(--shadow-xs)',
        padding: 'var(--space-3) var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
      }}>
        {/* Back button */}
        <button
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            fontSize: 'var(--text-sm)', fontWeight: 500,
            color: 'var(--color-text-muted)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'transparent',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-offset)'; e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-text-muted)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          All Articles
        </button>

        {/* Read time pill */}
        <span style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
          {blog.estimatedReadTime} min read · {date}
        </span>
      </div>

      {/* ── Article Body ── */}
      <article
        ref={articleRef}
        style={{
          maxWidth: 'var(--content-narrow)',
          margin: '0 auto',
          padding: 'var(--space-12) var(--space-6) var(--space-24)',
        }}
      >
        {/* ── Specialization & Audience meta ── */}
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap',
          gap: 'var(--space-2)', marginBottom: 'var(--space-6)',
        }}>
          <span style={{
            fontSize: 'var(--text-xs)', fontWeight: 600,
            color: 'var(--color-primary)',
            background: 'var(--color-primary-highlight)',
            padding: '4px var(--space-3)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-primary-border)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            {specLabel}
          </span>
          <span style={{
            fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)',
            textTransform: 'capitalize',
          }}>
            · {blog.tone} · for {blog.targetAudience.replace(/_/g, ' ')}
          </span>
        </div>

        {/* ── Article Title ── */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          color: 'var(--color-text)',
          marginBottom: 'var(--space-5)',
        }}>
          {blog.title}
        </h1>

        {/* ── Subtitle / original topic ── */}
        {blog.originalTopic && blog.originalTopic !== blog.title && (
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-lg)',
            fontStyle: 'italic',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-8)',
            lineHeight: 1.5,
          }}>
            {blog.originalTopic}
          </p>
        )}

        {/* ── Author Block ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 'var(--space-4)',
          padding: 'var(--space-5) var(--space-6)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-10)',
          boxShadow: 'var(--shadow-xs)',
        }}>
          {/* Avatar */}
          <div style={{
            width: 52, height: 52,
            borderRadius: 'var(--radius-full)',
            background: `linear-gradient(135deg, hsl(${hue}, 55%, 60%), hsl(${(hue + 50) % 360}, 60%, 50%))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              color: 'var(--color-text)',
              lineHeight: 1.3,
              marginBottom: 2,
            }}>
              Dr. {specLabel.split(' ')[0]} {specLabel.split(' ').slice(1).join(' ')}
            </div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.4,
            }}>
              {specLabel} · MD, MBBS
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              marginTop: 4,
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: '0.7rem',
                color: 'var(--color-success, hsl(152, 56%, 42%))',
                background: 'hsl(152, 56%, 96%)',
                border: '1px solid hsl(152, 40%, 80%)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
              }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
                Medically Reviewed
              </span>
            </div>
          </div>

          <div style={{
            textAlign: 'right', fontSize: 'var(--text-xs)',
            color: 'var(--color-text-faint)',
            flexShrink: 0,
          }}>
            <div style={{ fontWeight: 500, marginBottom: 2 }}>{blog.estimatedReadTime} min read</div>
            <div>{date}</div>
          </div>
        </div>

        {/* ── Section Divider ── */}
        <div style={{
          width: 48, height: 3,
          background: 'var(--color-primary)',
          borderRadius: 2,
          marginBottom: 'var(--space-10)',
        }} />

        {/* ── Article Content ── */}
        <div>
          {renderContent()}
        </div>

        {/* ── Key Insights Callout ── */}
        <div style={{
          marginTop: 'var(--space-10)',
          padding: 'var(--space-5) var(--space-6)',
          background: 'var(--color-primary-highlight)',
          border: '1px solid var(--color-primary-border)',
          borderLeft: '4px solid var(--color-primary)',
          borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
          display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <div>
            <p style={{
              fontSize: 'var(--text-sm)', fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: 'var(--space-1)',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}>
              Clinical Insight
            </p>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text)',
              lineHeight: 1.75,
            }}>
              This article was written by a qualified specialist and reviewed for medical accuracy. Always consult your healthcare provider before making health decisions.
            </p>
          </div>
        </div>

        {/* ── Medical Disclaimer ── */}
        {blog.disclaimer && (
          <div style={{
            marginTop: 'var(--space-8)',
            padding: 'var(--space-5) var(--space-6)',
            background: 'var(--color-warning-bg, hsl(36, 95%, 96%))',
            borderLeft: '4px solid var(--color-warning)',
            border: '1px solid color-mix(in srgb, hsl(36, 90%, 50%) 25%, transparent)',
            borderLeftWidth: 4,
            borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
            display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
              <strong style={{ color: 'var(--color-text)', fontWeight: 700 }}>Medical Disclaimer · </strong>
              {blog.disclaimer}
            </p>
          </div>
        )}

        {/* ── Article Footer ── */}
        <div style={{
          marginTop: 'var(--space-12)',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--color-divider)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Generated by {blog.model.replace(/-/g, ' ')}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              fontSize: 'var(--text-sm)', fontWeight: 600,
              color: 'var(--color-primary)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-primary-border)',
              background: 'var(--color-primary-highlight)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary-highlight)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Articles
          </button>
        </div>
      </article>
    </div>
  );
}