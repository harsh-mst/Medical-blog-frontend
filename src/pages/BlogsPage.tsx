import { useState } from 'react';
import { BlogCard } from '../components/BlogCard';
import { AddBlogModal } from '../components/AddBlogModal';
import { BlogReader } from '../components/BlogReader';
import { generateBlog } from '../lib/api';
import type { BlogPost, GenerateRequest } from '../types/blog';

export function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async (req: GenerateRequest) => {
    setIsGenerating(true);
    setError('');
    try {
      const res = await generateBlog(req);
      setBlogs(prev => [res.data, ...prev]);
      setShowModal(false);
      setActiveBlog(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (activeBlog) return <BlogReader blog={activeBlog} onClose={() => setActiveBlog(null)} />;

  return (
    <main style={{
      flex: 1,
      background: 'var(--color-bg)',
    }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-primary-highlight) 100%)',
        borderBottom: '1px solid var(--color-divider)',
        padding: 'var(--space-16) var(--space-6)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative rings */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600,
          borderRadius: '50%',
          border: '1px solid var(--color-primary-border)',
          opacity: 0.2,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400, height: 400,
          borderRadius: '50%',
          border: '1px solid var(--color-primary-border)',
          opacity: 0.3,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          {/* Pill label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 'var(--text-xs)', fontWeight: 700,
            color: 'var(--color-primary)',
            background: 'var(--color-primary-highlight)',
            border: '1px solid var(--color-primary-border)',
            padding: '4px var(--space-3)',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-5)',
          }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="var(--color-primary)">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Gemini AI · Doctor Publishing Platform
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 5vw, 2.875rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--color-text)',
            lineHeight: 1.15,
            marginBottom: 'var(--space-4)',
          }}>
            Evidence-Based Medical Publishing
          </h1>

          <p style={{
            fontSize: 'var(--text-md)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.7,
            marginBottom: 'var(--space-8)',
            maxWidth: 480,
            margin: '0 auto var(--space-8)',
          }}>
            Write credible, readable medical articles in your voice — powered by AI, guided by your expertise.
          </p>

          {/* CTA Button */}
          <button
            id="add-blog-btn"
            onClick={() => { setShowModal(true); setError(''); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-4) var(--space-7)',
              background: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-base)', fontWeight: 600,
              border: 'none',
              boxShadow: '0 4px 16px hsl(196, 72%, 38% / 0.35), 0 1px 4px hsl(196, 72%, 38% / 0.2)',
              cursor: 'pointer',
              transition: 'all var(--transition-interactive)',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--color-primary-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px hsl(196, 72%, 38% / 0.45), 0 2px 8px hsl(196, 72%, 38% / 0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 16px hsl(196, 72%, 38% / 0.35), 0 1px 4px hsl(196, 72%, 38% / 0.2)';
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Write New Article
          </button>

          {/* Trust badges */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'var(--space-6)', marginTop: 'var(--space-8)',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: '🩺', label: 'Doctor-Authored' },
              { icon: '🔬', label: 'Evidence-Based' },
              { icon: '✅', label: 'Medically Reviewed' },
            ].map(b => (
              <span key={b.label} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
                fontWeight: 500,
              }}>
                <span>{b.icon}</span> {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Zone ── */}
      <div style={{
        maxWidth: 'var(--content-wide)',
        margin: '0 auto',
        padding: 'var(--space-10) var(--space-6) var(--space-16)',
      }}>

        {/* ── Error Banner ── */}
        {error && !showModal && (
          <div role="alert" style={{
            padding: 'var(--space-4) var(--space-5)',
            marginBottom: 'var(--space-6)',
            background: 'var(--color-error-highlight)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid color-mix(in srgb, var(--color-error) 20%, transparent)',
            borderLeft: '4px solid var(--color-error)',
            fontSize: 'var(--text-sm)', color: 'var(--color-text)',
            display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
            animation: 'fadeIn 200ms ease',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span style={{ flex: 1 }}>{error}</span>
            <button
              onClick={() => setError('')}
              aria-label="Dismiss error"
              style={{
                color: 'var(--color-text-muted)', flexShrink: 0,
                display: 'flex', alignItems: 'center',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Section Bar ── */}
        {blogs.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 'var(--space-7)', flexWrap: 'wrap', gap: 'var(--space-3)',
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-xl)',
                fontWeight: 700,
                color: 'var(--color-text)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: 'var(--space-1)',
              }}>
                Your Articles
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                {blogs.length} article{blogs.length > 1 ? 's' : ''} published
              </p>
            </div>
            <button
              onClick={() => { setShowModal(true); setError(''); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-4)',
                background: 'var(--color-surface)',
                color: 'var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)', fontWeight: 600,
                border: '1px solid var(--color-primary-border)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-highlight)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Article
            </button>
          </div>
        )}

        {/* ── Grid or Empty State ── */}
        {blogs.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
            gap: 'var(--space-6)',
          }}>
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} onClick={() => setActiveBlog(blog)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--color-divider)',
        background: 'var(--color-surface)',
        padding: 'var(--space-8) var(--space-6)',
      }}>
        <div style={{
          maxWidth: 'var(--content-wide)',
          margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 'var(--space-4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <svg width="20" height="20" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="9" fill="var(--color-primary)" />
              <path d="M17 9v16M9 17h16" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-sm)', fontWeight: 700,
              color: 'var(--color-text)',
            }}>MedInsight</span>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
            AI-assisted medical content. Always verify with a qualified healthcare professional.
          </p>
        </div>
      </footer>

      {/* ── Modal ── */}
      {showModal && (
        <AddBlogModal
          onClose={() => { if (!isGenerating) { setShowModal(false); setError(''); } }}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          error={error}
        />
      )}
    </main>
  );
}

/* ── Empty State Component ── */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-20) var(--space-8)',
      maxWidth: 480,
      margin: '0 auto',
      animation: 'fadeUp 400ms ease',
    }}>
      {/* Illustration */}
      <div style={{
        width: 80, height: 80,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-primary-highlight)',
        border: '1px solid var(--color-primary-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto var(--space-6)',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--color-text)',
        letterSpacing: '-0.02em',
        marginBottom: 'var(--space-3)',
      }}>
        No articles yet
      </h3>

      <p style={{
        fontSize: 'var(--text-md)',
        color: 'var(--color-text-muted)',
        lineHeight: 1.7,
        marginBottom: 'var(--space-8)',
      }}>
        Start publishing evidence-based content. Write your first medical article using Gemini AI — in your voice, for your patients.
      </p>

      <button
        onClick={onAdd}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: 'var(--space-3) var(--space-7)',
          background: 'var(--color-primary)',
          color: 'white',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-sm)', fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 16px hsl(196, 72%, 38% / 0.3)',
          transition: 'all var(--transition-interactive)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Write your first article
      </button>
    </div>
  );
}