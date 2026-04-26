/** Unified blog post — covers both the generate response and the saved-blogs list */
export interface BlogPost {
  /** Primary key — may come as `id` (generate) or `blogId` (saved list) */
  blogId: string;
  title: string;
  content: string;
  originalTopic: string;
  specialization: string;
  targetAudience: string;
  tone: string;
  estimatedReadTime: number;
  disclaimer: string | null;
  generatedAt: string;
  /** May come as `model` (generate) or `aiModel` (saved list) */
  model: string;
  createdAt?: string;
}

export interface GenerateRequest {
  topic: string;
  doctorNote?: string;
  includeDisclaimer: boolean;
}

export interface GenerateResponse {
  success: boolean;
  inferredParams?: {
    specialization: string;
    targetAudience: string;
    tone: string;
    wordCount: number;
  };
  data: BlogPost;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BlogListResponse {
  success: boolean;
  data: BlogPost[];
  pagination: Pagination;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  data: { blogId: string };
}

export interface DropdownOptions {
  specializations: string[];
  targetAudiences: string[];
  tones: string[];
}