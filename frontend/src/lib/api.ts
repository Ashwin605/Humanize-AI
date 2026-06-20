const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("lexwrite_token");
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  register(data: { name: string; email: string; password: string }) {
    return this.request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  login(data: { email: string; password: string }) {
    return this.request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  googleAuth(data: { googleId: string; email: string; name: string; avatarUrl?: string }) {
    return this.request<{ token: string; user: User }>("/auth/google", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  forgotPassword(email: string) {
    return this.request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  getMe() {
    return this.request<User>("/auth/me");
  }

  // Documents
  getDocuments() {
    return this.request<Document[]>("/documents");
  }

  getDocument(id: string) {
    return this.request<DocumentDetail>(`/documents/${id}`);
  }

  getStats() {
    return this.request<DashboardStats>("/documents/stats");
  }

  createDocument(data: Partial<Document>) {
    return this.request<Document>("/documents", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateDocument(id: string, data: Partial<Document>) {
    return this.request<Document>(`/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteDocument(id: string) {
    return this.request<{ message: string }>(`/documents/${id}`, { method: "DELETE" });
  }

  enhanceDocument(id: string, data?: { feature?: string; text?: string; provider?: string }) {
    return this.request<{ document: Document; enhancedText: string; tokensUsed: number }>(
      `/documents/${id}/enhance`,
      { method: "POST", body: JSON.stringify(data || {}) }
    );
  }

  analyzeDocument(id: string, text?: string) {
    return this.request<DocumentAnalysis>(`/documents/${id}/analyze`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  }

  importDocument(file: File, title?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);

    const token = this.getToken();
    return fetch(`${API_URL}/documents/import`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then((r) => r.json()) as Promise<Document>;
  }

  exportDocument(id: string, format: string) {
    const token = this.getToken();
    return fetch(`${API_URL}/documents/${id}/export?format=${format}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  legalAssistant(tool: string, input: string) {
    return this.request<{ result: string; tokensUsed: number }>("/documents/assistant", {
      method: "POST",
      body: JSON.stringify({ tool, input }),
    });
  }

  // Templates
  getTemplates() {
    return this.request<Template[]>("/templates");
  }

  createTemplate(data: Partial<Template>) {
    return this.request<Template>("/templates", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  deleteTemplate(id: string) {
    return this.request<{ message: string }>(`/templates/${id}`, { method: "DELETE" });
  }

  // Citations
  getCitations() {
    return this.request<Citation[]>("/citations");
  }

  createCitation(data: Partial<Citation>) {
    return this.request<Citation>("/citations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  deleteCitation(id: string) {
    return this.request<{ message: string }>(`/citations/${id}`, { method: "DELETE" });
  }

  // Admin
  getAdminDashboard() {
    return this.request<AdminDashboard>("/admin/dashboard");
  }

  getAdminUsers(page = 1) {
    return this.request<{ users: User[]; total: number; page: number; pages: number }>(
      `/admin/users?page=${page}`
    );
  }

  getAuditLogs() {
    return this.request<AuditLog[]>("/admin/audit-logs");
  }
}

export const api = new ApiClient();

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  emailVerified: boolean;
  subscription?: Subscription;
  createdAt?: string;
}

export interface Subscription {
  plan: string;
  status: string;
  documentsLimit: number;
  wordsLimit: number;
}

export interface Document {
  id: string;
  title: string;
  originalText: string;
  enhancedText?: string;
  enhancementMode: string;
  citationFormat: string;
  status: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  analysis?: DocumentAnalysis;
}

export interface DocumentDetail extends Document {
  versions: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  version: number;
  originalText: string;
  enhancedText?: string;
  changeNote?: string;
  createdAt: string;
}

export interface DocumentAnalysis {
  readabilityScore: number;
  grammarScore: number;
  coherenceScore: number;
  legalTerminologyDensity: number;
  sentenceVarietyScore: number;
  citationConsistencyScore: number;
  insights?: string[];
}

export interface DashboardStats {
  totalDocuments: number;
  totalWords: number;
  enhancedDocuments: number;
  recentDocuments: Document[];
  usageByDay: UsageLog[];
}

export interface UsageLog {
  id: string;
  action: string;
  tokensUsed: number;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  content: string;
  enhancementMode: string;
  isPublic: boolean;
}

export interface Citation {
  id: string;
  title: string;
  citation: string;
  format: string;
  notes?: string;
  tags: string[];
}

export interface AdminDashboard {
  totalUsers: number;
  totalDocuments: number;
  activeSubscriptions: number;
  totalWords: number;
  usageToday: number;
  recentUsers: User[];
  systemHealth: string;
}

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  details?: Record<string, unknown>;
  createdAt: string;
  user?: { name: string; email: string };
}
