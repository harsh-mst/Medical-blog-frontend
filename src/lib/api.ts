import type {
  BlogListResponse,
  BlogPost,
  DeleteResponse,
  DropdownOptions,
  GenerateRequest,
  GenerateResponse,
} from '../types/blog';

const BASE = import.meta.env.VITE_API_URL ?? 'https://medical-blog-backend.onrender.com';

/** Normalise a raw blog object coming from either endpoint into a unified BlogPost */
function normaliseBlog(raw: Record<string, unknown>): BlogPost {
  return {
    blogId: (raw.blogId ?? raw.id) as string,
    title: raw.title as string,
    content: raw.content as string,
    originalTopic: raw.originalTopic as string,
    specialization: raw.specialization as string,
    targetAudience: raw.targetAudience as string,
    tone: raw.tone as string,
    estimatedReadTime: raw.estimatedReadTime as number,
    disclaimer: (raw.disclaimer ?? null) as string | null,
    generatedAt: raw.generatedAt as string,
    model: (raw.aiModel ?? raw.model) as string,
    createdAt: raw.createdAt as string | undefined,
  };
}

async function handleError(res: Response): Promise<never> {
  let msg = `Server error (${res.status})`;
  try {
    const body = await res.json();
    msg = body?.message ?? msg;
  } catch { /* ignore */ }
  throw new Error(msg);
}

/* ─── Generate ─────────────────────────────────────────────────────────── */

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

  if (!res.ok) return handleError(res);

  const json = await res.json();
  return {
    ...json,
    data: normaliseBlog(json.data),
  } as GenerateResponse;
}

/* ─── Fetch all saved blogs ─────────────────────────────────────────────── */

export interface FetchBlogsParams {
  page?: number;
  limit?: number;
  specialization?: string;
  targetAudience?: string;
  tone?: string;
}

export async function fetchBlogs(params: FetchBlogsParams = {}): Promise<BlogListResponse> {
  const query = new URLSearchParams();
  if (params.page)           query.set('page', String(params.page));
  if (params.limit)          query.set('limit', String(params.limit));
  if (params.specialization) query.set('specialization', params.specialization);
  if (params.targetAudience) query.set('targetAudience', params.targetAudience);
  if (params.tone)           query.set('tone', params.tone);

  const res = await fetch(`${BASE}/api/blogs?${query.toString()}`);
  if (!res.ok) return handleError(res);

  const json = await res.json();
  return {
    ...json,
    data: (json.data as Record<string, unknown>[]).map(normaliseBlog),
  } as BlogListResponse;
}

/* ─── Delete a blog ─────────────────────────────────────────────────────── */

export async function deleteBlog(blogId: string): Promise<DeleteResponse> {
  const res = await fetch(`${BASE}/api/blogs/${blogId}`, { method: 'DELETE' });
  if (!res.ok) return handleError(res);
  return res.json() as Promise<DeleteResponse>;
}

/* ─── Dropdown options ──────────────────────────────────────────────────── */

export async function getOptions(): Promise<DropdownOptions> {
  const res = await fetch(`${BASE}/api/options`);
  if (!res.ok) return handleError(res);
  return res.json() as Promise<DropdownOptions>;
}

/* ─── Health check ──────────────────────────────────────────────────────── */

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}