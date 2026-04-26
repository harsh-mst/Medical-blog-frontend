import { useEffect, useRef, useState } from 'react';

const CATEGORIES = ['All', 'Mental Health', 'Cardiology', 'Nutrition', 'Neurology', 'Sleep', 'Oncology'];

function MedInsightLogo() {
  return (
    <svg aria-label="MedInsight logo" width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect width="34" height="34" rx="9" fill="var(--color-primary)" />
      {/* Cross mark */}
      <path d="M17 9v16M9 17h16" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
      {/* Small heart beat line */}
      <path d="M10 21h2l2-4 2 7 2-10 2 7h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

interface HeaderProps {
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
}

export function Header({ activeCategory = 'All', onCategoryChange }: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled
        ? (theme === 'dark'
          ? 'rgba(23, 28, 37, 0.94)'
          : 'rgba(255, 255, 255, 0.92)')
        : 'var(--color-surface)',
      backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
      borderBottom: '1px solid var(--color-divider)',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      transition: 'background var(--transition-interactive), box-shadow var(--transition-interactive)',
    }}>

      {/* ── Main nav bar ── */}
      <div style={{
        maxWidth: 'var(--content-wide)',
        margin: '0 auto',
        padding: 'var(--space-3) var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-5)',
      }}>

        {/* Brand */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', textDecoration: 'none', flexShrink: 0 }}>
          <MedInsightLogo />
          <div>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}>MedInsight</span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              color: 'var(--color-text-faint)',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              fontWeight: 500,
              lineHeight: 1.3,
            }}>Clinical Publishing</span>
          </div>
        </a>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: 'var(--color-border)', flexShrink: 0 }} />

        {/* Category pills — hidden on mobile */}
        <nav aria-label="Blog categories" style={{
          display: 'flex', gap: 'var(--space-1)',
          flex: 1, overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange?.(cat)}
              style={{
                padding: '5px var(--space-3)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: activeCategory === cat ? 600 : 500,
                whiteSpace: 'nowrap',
                color: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-text-muted)',
                background: activeCategory === cat ? 'var(--color-primary-highlight)' : 'transparent',
                border: activeCategory === cat
                  ? '1px solid var(--color-primary-border)'
                  : '1px solid transparent',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.color = 'var(--color-text)';
                  e.currentTarget.style.background = 'var(--color-surface-offset)';
                }
              }}
              onMouseLeave={e => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Right side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>

          {/* Search bar (expandable) */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {searchOpen && (
              <input
                ref={searchRef}
                type="search"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Search articles…"
                onBlur={() => { if (!searchValue) setSearchOpen(false); }}
                style={{
                  width: 200,
                  padding: '6px var(--space-3) 6px 32px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-primary-border)',
                  background: 'var(--color-surface-2)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  animation: 'slideDown 200ms ease',
                  boxShadow: '0 0 0 3px var(--color-primary-highlight)',
                }}
              />
            )}
            {searchOpen && (
              <svg style={{ position: 'absolute', left: 10, pointerEvents: 'none', color: 'var(--color-text-faint)' }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            )}
            <button
              onClick={() => setSearchOpen(v => !v)}
              aria-label="Search"
              title="Search articles"
              style={{
                width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                background: 'transparent',
                transition: 'all var(--transition-fast)',
                ...(searchOpen ? { marginLeft: 'var(--space-1)' } : {}),
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-offset)'; e.currentTarget.style.color = 'var(--color-text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* AI Badge */}
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 'var(--text-xs)', fontWeight: 600,
            color: 'var(--color-primary)',
            background: 'var(--color-primary-highlight)',
            padding: '4px var(--space-3)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-primary-border)',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Gemini AI
          </span>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
              background: 'transparent',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-offset)'; e.currentTarget.style.color = 'var(--color-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}