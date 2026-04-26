import { useState } from 'react';
import type { GenerateRequest } from '../types/blog';
import { DoctorNoteHints } from './DoctorNoteHints';

interface Props {
  onClose: () => void;
  onGenerate: (req: GenerateRequest) => void;
  isGenerating: boolean;
  error?: string;
}

export function AddBlogModal({ onClose, onGenerate, isGenerating }: Props) {
  const [topic, setTopic] = useState('');
  const [doctorNote, setDoctorNote] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [includeDisclaimer, setIncludeDisclaimer] = useState(true);
  const [topicError, setTopicError] = useState('');

  const handleGenerate = () => {
    if (topic.trim().length < 5) {
      setTopicError('Topic must be at least 5 characters');
      return;
    }
    setTopicError('');
    onGenerate({ topic: topic.trim(), doctorNote: doctorNote.trim() || undefined, includeDisclaimer });
  };

  const inputBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: 'var(--space-3) var(--space-4)',
    background: 'var(--color-surface-2)',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text)',
    outline: 'none',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    lineHeight: 1.6,
  };

  return (
    <>
      <style>{`
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* Backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'var(--space-4)',
          background: 'rgba(10, 14, 22, 0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'overlayIn 200ms ease',
        }}
        onClick={e => e.target === e.currentTarget && !isGenerating && onClose()}
      >
        {/* Modal Panel */}
        <div style={{
          width: '100%', maxWidth: 600,
          maxHeight: '92dvh',
          display: 'flex', flexDirection: 'column',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
          animation: 'modalIn 250ms cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
        }}>

          {/* ── Header ── */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            padding: 'var(--space-6) var(--space-6) var(--space-5)',
            borderBottom: '1px solid var(--color-divider)',
            flexShrink: 0,
            background: 'linear-gradient(to bottom, var(--color-surface), var(--color-surface))',
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
              {/* Icon */}
              <div style={{
                width: 40, height: 40,
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-primary-highlight)',
                border: '1px solid var(--color-primary-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-lg)', fontWeight: 700,
                  color: 'var(--color-text)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}>
                  New Medical Article
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Describe your topic — AI writes in your clinical voice
                </p>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              disabled={isGenerating}
              aria-label="Close"
              style={{
                width: 32, height: 32, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-muted)',
                transition: 'all var(--transition-fast)',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating ? 0.4 : 1,
              }}
              onMouseEnter={e => { if (!isGenerating) { e.currentTarget.style.background = 'var(--color-surface-offset)'; e.currentTarget.style.color = 'var(--color-text)'; }}}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Body (scrollable) ── */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-6)',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-6)',
          }}>

            {/* Topic Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--text-sm)', fontWeight: 600,
                color: 'var(--color-text)',
                marginBottom: 'var(--space-2)',
              }}>
                Article Topic
                <span style={{ color: 'var(--color-error)', marginLeft: 3 }}>*</span>
              </label>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', lineHeight: 1.5 }}>
                Enter a specific medical topic, question, or condition you want to write about.
              </p>
              <input
                type="text"
                id="blog-topic"
                value={topic}
                onChange={e => { setTopic(e.target.value); if (topicError) setTopicError(''); }}
                placeholder="e.g. Managing anxiety disorders without over-medicating"
                maxLength={200}
                style={{
                  ...inputBase,
                  borderColor: topicError ? 'var(--color-error)' : 'var(--color-border)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = topicError ? 'var(--color-error)' : 'var(--color-primary)';
                  e.target.style.boxShadow = `0 0 0 3px ${topicError ? 'hsl(0, 80%, 95%)' : 'var(--color-primary-highlight)'}`;
                }}
                onBlur={e => {
                  e.target.style.borderColor = topicError ? 'var(--color-error)' : 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-1)' }}>
                {topicError
                  ? <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                      </svg>
                      {topicError}
                    </span>
                  : <span />}
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>{topic.length}/200</span>
              </div>
            </div>

            {/* Context / Doctor Note */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
                  Your Clinical Context
                  <span style={{
                    fontSize: 'var(--text-xs)', fontWeight: 400,
                    color: 'var(--color-text-faint)', marginLeft: 'var(--space-2)',
                  }}>
                    optional
                  </span>
                </label>
                <button
                  onClick={() => setShowHints(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 'var(--text-xs)', fontWeight: 600,
                    color: 'var(--color-primary)',
                    padding: '4px var(--space-3)',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-primary-border)',
                    background: 'var(--color-primary-highlight)',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary-highlight)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                >
                  {showHints ? 'Hide tips' : '✦ Show tips'}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d={showHints ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
                  </svg>
                </button>
              </div>
              <textarea
                id="doctor-note"
                value={doctorNote}
                onChange={e => setDoctorNote(e.target.value)}
                placeholder="Describe your specialty, who you're writing for, tone, length, and any specific clinical angles to cover…"
                maxLength={1000}
                rows={4}
                style={{
                  ...inputBase,
                  resize: 'vertical',
                  minHeight: 100,
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--color-primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--color-primary-highlight)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>{doctorNote.length}/1000</span>
              </div>
              {showHints && <DoctorNoteHints />}
            </div>

            {/* Disclaimer Toggle */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              cursor: 'pointer',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: `1.5px solid ${includeDisclaimer ? 'var(--color-primary-border)' : 'var(--color-border)'}`,
              background: includeDisclaimer ? 'var(--color-primary-highlight)' : 'var(--color-surface-2)',
              transition: 'all var(--transition-fast)',
            }}>
              <input
                type="checkbox"
                id="include-disclaimer"
                checked={includeDisclaimer}
                onChange={e => setIncludeDisclaimer(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--color-primary)', cursor: 'pointer', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
                  Include Medical Disclaimer
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Appends a professional disclaimer reminding readers to consult their physician.
                </div>
              </div>
            </label>
          </div>

          {/* ── Footer ── */}
          <div style={{
            padding: 'var(--space-4) var(--space-6)',
            borderTop: '1px solid var(--color-divider)',
            background: 'var(--color-surface-2)',
            display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end',
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <button
              onClick={onClose}
              disabled={isGenerating}
              style={{
                padding: 'var(--space-3) var(--space-5)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)', fontWeight: 500,
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating ? 0.5 : 1,
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => { if (!isGenerating) e.currentTarget.style.background = 'var(--color-surface-offset)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              Cancel
            </button>

            <button
              id="generate-blog-btn"
              onClick={handleGenerate}
              disabled={isGenerating || topic.trim().length < 5}
              style={{
                padding: 'var(--space-3) var(--space-7)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)', fontWeight: 700,
                color: 'white',
                background: 'var(--color-primary)',
                border: 'none',
                cursor: isGenerating || topic.trim().length < 5 ? 'not-allowed' : 'pointer',
                opacity: isGenerating || topic.trim().length < 5 ? 0.45 : 1,
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                minWidth: 172, justifyContent: 'center',
                transition: 'all var(--transition-fast)',
                boxShadow: isGenerating || topic.trim().length < 5 ? 'none' : '0 2px 8px hsl(196, 72%, 38% / 0.35)',
              }}
              onMouseEnter={e => {
                if (!isGenerating && topic.trim().length >= 5) {
                  e.currentTarget.style.background = 'var(--color-primary-hover)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--color-primary)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {isGenerating ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Generating Article…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Generate with Gemini
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}