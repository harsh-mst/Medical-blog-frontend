import { useCallback, useEffect, useState } from 'react';
import { BlogCard } from '../components/BlogCard';
import { AddBlogModal } from '../components/AddBlogModal';
import { BlogReader } from '../components/BlogReader';
import { generateBlog, fetchBlogs, deleteBlog } from '../lib/api';
import type { BlogPost, GenerateRequest, Pagination } from '../types/blog';

const PAGE_LIMIT = 9;

/* ── Spinner ────────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-20)' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5"
        style={{ animation: 'spin 0.8s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Filter Bar ─────────────────────────────────────────────────────────── */
interface Filters { specialization: string; tone: string; targetAudience: string; }
function FilterBar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const sel: React.CSSProperties = {
    padding: 'var(--space-2) var(--space-3)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
    outline: 'none',
  };
  const active = filters.specialization || filters.tone || filters.targetAudience;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
      <select style={sel} value={filters.specialization}
        onChange={e => onChange({ ...filters, specialization: e.target.value })}>
        <option value="">All specializations</option>
        {['cardiologist','neurologist','pediatrician','oncologist','dermatologist',
          'orthopedist','psychiatrist','endocrinologist','gastroenterologist',
          'pulmonologist','infectious_disease','emergency_medicine','general_practitioner']
          .map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
      </select>
      <select style={sel} value={filters.tone}
        onChange={e => onChange({ ...filters, tone: e.target.value })}>
        <option value="">All tones</option>
        {['compassionate','clinical','educational','motivational','reassuring']
          .map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select style={sel} value={filters.targetAudience}
        onChange={e => onChange({ ...filters, targetAudience: e.target.value })}>
        <option value="">All audiences</option>
        {['patients','medical_professionals','general_public','caregivers']
          .map(a => <option key={a} value={a}>{a.replace(/_/g,' ')}</option>)}
      </select>
      {active && (
        <button onClick={() => onChange({ specialization: '', tone: '', targetAudience: '' })}
          style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', background: 'none',
            border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Clear filters
        </button>
      )}
    </div>
  );
}

/* ── Pagination Controls ─────────────────────────────────────────────────── */
function PaginationBar({ pagination, onPage }: { pagination: Pagination; onPage: (p: number) => void }) {
  const { page, totalPages, hasNextPage, hasPrevPage, total } = pagination;
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 'var(--space-3)', marginTop: 'var(--space-10)', flexWrap: 'wrap' }}>
      <button disabled={!hasPrevPage} onClick={() => onPage(page - 1)}
        style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)', background: 'var(--color-surface)',
          color: hasPrevPage ? 'var(--color-text)' : 'var(--color-text-faint)',
          cursor: hasPrevPage ? 'pointer' : 'not-allowed', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
        ← Prev
      </button>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        Page {page} of {totalPages} &nbsp;·&nbsp; {total} article{total !== 1 ? 's' : ''}
      </span>
      <button disabled={!hasNextPage} onClick={() => onPage(page + 1)}
        style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)', background: 'var(--color-surface)',
          color: hasNextPage ? 'var(--color-text)' : 'var(--color-text-faint)',
          cursor: hasNextPage ? 'pointer' : 'not-allowed', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
        Next →
      </button>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({ specialization: '', tone: '', targetAudience: '' });

  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* ── Fetch blogs ─────────────────────────────────────────────────────── */
  const loadBlogs = useCallback(async (p: number, f: Filters) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetchBlogs({
        page: p,
        limit: PAGE_LIMIT,
        specialization: f.specialization || undefined,
        tone: f.tone || undefined,
        targetAudience: f.targetAudience || undefined,
      });
      setBlogs(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadBlogs(page, filters); }, [page, filters, loadBlogs]);

  /* Reset to page 1 when filters change */
  const handleFilterChange = (f: Filters) => {
    setFilters(f);
    setPage(1);
  };

  /* ── Generate ────────────────────────────────────────────────────────── */
  const handleGenerate = async (req: GenerateRequest) => {
    setIsGenerating(true);
    setError('');
    try {
      const res = await generateBlog(req);
      setShowModal(false);
      setActiveBlog(res.data);
      /* Refresh page 1 so the new blog appears */
      setPage(1);
      await loadBlogs(1, filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  /* ── Delete ──────────────────────────────────────────────────────────── */
  const handleDelete = async (blogId: string) => {
    if (!window.confirm('Delete this article permanently?')) return;
    setDeletingId(blogId);
    /* Optimistic remove */
    setBlogs(prev => prev.filter(b => b.blogId !== blogId));
    try {
      await deleteBlog(blogId);
      /* Reload to get correct pagination totals */
      await loadBlogs(page, filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
      /* Reload to restore removed blog on failure */
      await loadBlogs(page, filters);
    } finally {
      setDeletingId(null);
    }
  };

  if (activeBlog) return <BlogReader blog={activeBlog} onClose={() => setActiveBlog(null)} />;

  return (
    <main style={{ flex: 1, background: 'var(--color-bg)' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-primary-highlight) 100%)',
        borderBottom: '1px solid var(--color-divider)',
        padding: 'var(--space-16) var(--space-6)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%', border: '1px solid var(--color-primary-border)',
          opacity: 0.2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 400, height: 400, borderRadius: '50%', border: '1px solid var(--color-primary-border)',
          opacity: 0.3, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)',
            background: 'var(--color-primary-highlight)', border: '1px solid var(--color-primary-border)',
            padding: '4px var(--space-3)', borderRadius: 'var(--radius-full)',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 'var(--space-5)' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="var(--color-primary)">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Gemini AI · Doctor Publishing Platform
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 2.875rem)',
            fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--color-text)',
            lineHeight: 1.15, marginBottom: 'var(--space-4)' }}>
            Evidence-Based Medical Publishing
          </h1>

          <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-muted)', lineHeight: 1.7,
            marginBottom: 'var(--space-8)', maxWidth: 480, margin: '0 auto var(--space-8)' }}>
            Write credible, readable medical articles in your voice — powered by AI, guided by your expertise.
          </p>

          <button id="add-blog-btn" onClick={() => { setShowModal(true); setError(''); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-4) var(--space-7)', background: 'var(--color-primary)',
              color: 'white', borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-base)', fontWeight: 600, border: 'none',
              boxShadow: '0 4px 16px hsl(196, 72%, 38% / 0.35)', cursor: 'pointer',
              transition: 'all var(--transition-interactive)', letterSpacing: '-0.01em' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Write New Article
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'var(--space-6)', marginTop: 'var(--space-8)', flexWrap: 'wrap' }}>
            {[{ icon: '🩺', label: 'Doctor-Authored' }, { icon: '🔬', label: 'Evidence-Based' }, { icon: '✅', label: 'Medically Reviewed' }]
              .map(b => (
                <span key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  <span>{b.icon}</span> {b.label}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* ── Content Zone ── */}
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto',
        padding: 'var(--space-10) var(--space-6) var(--space-16)' }}>

        {/* Error Banner */}
        {error && !showModal && (
          <div role="alert" style={{ padding: 'var(--space-4) var(--space-5)', marginBottom: 'var(--space-6)',
            background: 'var(--color-error-highlight)', borderRadius: 'var(--radius-lg)',
            border: '1px solid color-mix(in srgb, var(--color-error) 20%, transparent)',
            borderLeft: '4px solid var(--color-error)', fontSize: 'var(--text-sm)',
            color: 'var(--color-text)', display: 'flex', alignItems: 'flex-start',
            gap: 'var(--space-3)', animation: 'fadeIn 200ms ease' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            <span style={{ flex: 1 }}>{error}</span>
            <button onClick={() => setError('')} aria-label="Dismiss error"
              style={{ color: 'var(--color-text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Section Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)',
              fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em',
              lineHeight: 1.2, marginBottom: 'var(--space-1)' }}>
              {pagination ? `${pagination.total} Article${pagination.total !== 1 ? 's' : ''}` : 'Articles'}
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              {pagination ? `Page ${pagination.page} of ${pagination.totalPages}` : 'Loading…'}
            </p>
          </div>
          <button onClick={() => { setShowModal(true); setError(''); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-4)', background: 'var(--color-surface)',
              color: 'var(--color-primary)', borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)', fontWeight: 600,
              border: '1px solid var(--color-primary-border)', cursor: 'pointer',
              transition: 'all var(--transition-fast)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-highlight)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Article
          </button>
        </div>

        {/* Filter Bar */}
        <FilterBar filters={filters} onChange={handleFilterChange} />

        {/* Grid / Loading / Empty */}
        {isLoading ? (
          <Spinner />
        ) : blogs.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} hasFilters={!!(filters.specialization || filters.tone || filters.targetAudience)} />
        ) : (
          <>
            <div style={{ display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
              gap: 'var(--space-6)' }}>
              {blogs.map(blog => (
                <BlogCard
                  key={blog.blogId}
                  blog={blog}
                  onClick={() => setActiveBlog(blog)}
                  onDelete={deletingId === blog.blogId ? undefined : handleDelete}
                />
              ))}
            </div>

            {pagination && <PaginationBar pagination={pagination} onPage={p => setPage(p)} />}
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--color-divider)', background: 'var(--color-surface)',
        padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <svg width="20" height="20" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="9" fill="var(--color-primary)" />
              <path d="M17 9v16M9 17h16" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)',
              fontWeight: 700, color: 'var(--color-text)' }}>MedInsight</span>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
            AI-assisted medical content. Always verify with a qualified healthcare professional.
          </p>
        </div>
      </footer>

      {/* Modal */}
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

/* ── Empty State ─────────────────────────────────────────────────────────── */
function EmptyState({ onAdd, hasFilters }: { onAdd: () => void; hasFilters: boolean }) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-20) var(--space-8)',
      maxWidth: 480, margin: '0 auto', animation: 'fadeUp 400ms ease' }}>
      <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-xl)',
        background: 'var(--color-primary-highlight)', border: '1px solid var(--color-primary-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-6)' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700,
        color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: 'var(--space-3)' }}>
        {hasFilters ? 'No matching articles' : 'No articles yet'}
      </h3>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 'var(--space-8)' }}>
        {hasFilters
          ? 'Try adjusting your filters to find articles.'
          : 'Start publishing evidence-based content. Write your first medical article using Gemini AI.'}
      </p>
      {!hasFilters && (
        <button onClick={onAdd}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-7)', background: 'var(--color-primary)',
            color: 'white', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)',
            fontWeight: 600, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 16px hsl(196, 72%, 38% / 0.3)',
            transition: 'all var(--transition-interactive)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Write your first article
        </button>
      )}
    </div>
  );
}