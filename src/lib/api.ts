import type { GenerateRequest, GenerateResponse } from '../types/blog';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function generateBlog(req: GenerateRequest): Promise<GenerateResponse> {
  const res = await fetch(`${BASE}/api/blogs/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: req.topic,
      doctorNote: req.doctorNote,
      includeDisclaimer: req.includeDisclaimer,
    }),
  });

  if (!res.ok) {
    let msg = `Server error (${res.status})`;
    try {
      const body = await res.json();
      msg = body?.message ?? msg;
    } catch { /* ignore */ }
    throw new Error(msg);
  }

  return res.json() as Promise<GenerateResponse>;
}