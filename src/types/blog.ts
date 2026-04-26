export interface BlogPost {
  id: string;
  title: string;
  content: string;
  originalTopic: string;  
  specialization: string;
  targetAudience: string;
  tone: string;
  estimatedReadTime: number;
  disclaimer: string | null;
  generatedAt: string;
  model: string;
}

export interface GenerateRequest {
  topic: string;
  doctorNote?: string;
  includeDisclaimer: boolean;
}

export interface GenerateResponse {
  success: boolean;
  data: BlogPost;
}