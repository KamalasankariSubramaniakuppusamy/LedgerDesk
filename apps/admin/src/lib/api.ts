const BASE = "/api/v1";

function token(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("ld_admin_token") ?? "";
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  const t = token();
  return {
    "Content-Type": "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...extra,
  };
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (res.status === 401) {
    localStorage.removeItem("ld_admin_token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Auth ---
export interface LoginPayload { email: string; password: string; }
export interface TokenResponse { access_token: string; token_type: string; }
export interface MeResponse {
  id: string; email: string; full_name: string; role: string; is_active: boolean;
}

export const authApi = {
  login: (data: LoginPayload) =>
    request<TokenResponse>("POST", "/auth/login", data),
  me: () => request<MeResponse>("GET", "/auth/me"),
};

// --- Users ---
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}
export interface CreateUserPayload {
  email: string;
  full_name: string;
  role: string;
  password: string;
}
export interface PatchUserPayload {
  full_name?: string;
  role?: string;
  is_active?: boolean;
}

export const usersApi = {
  list: () => request<User[]>("GET", "/users"),
  create: (data: CreateUserPayload) => request<User>("POST", "/users", data),
  patch: (id: string, data: PatchUserPayload) =>
    request<User>("PATCH", `/users/${id}`, data),
  deactivate: (id: string) => request<void>("DELETE", `/users/${id}`),
};

// --- Policies ---
export interface Policy {
  id: string;
  title: string;
  category: string;
  version: string;
  is_active: boolean;
  created_at: string;
}
export interface PolicyDetail extends Policy {
  content: string;
  metadata: Record<string, unknown> | null;
}
export interface PolicyPayload {
  title: string;
  category: string;
  version: string;
  content: string;
  metadata?: Record<string, unknown> | null;
}

export const policiesApi = {
  list: () => request<Policy[]>("GET", "/policies"),
  get: (id: string) => request<PolicyDetail>("GET", `/policies/${id}`),
  create: (data: PolicyPayload) => request<{ id: string; title: string }>("POST", "/policies", data),
  update: (id: string, data: PolicyPayload) =>
    request<{ id: string; title: string }>("PUT", `/policies/${id}`, data),
  deactivate: (id: string) => request<void>("DELETE", `/policies/${id}`),
};

// --- Cases / Audit ---
export interface CaseSummary {
  id: string;
  case_number: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
}

export interface AuditEvent {
  id: string;
  case_id: string;
  event_type: string;
  actor: string;
  description: string;
  created_at: string;
}

export const casesApi = {
  list: (params?: { status?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.limit)  qs.set("limit",  String(params.limit));
    if (params?.offset) qs.set("offset", String(params.offset));
    const q = qs.toString();
    return request<{ items: CaseSummary[]; total: number }>("GET", `/cases${q ? "?" + q : ""}`);
  },
  audit: (caseId: string) =>
    request<AuditEvent[]>("GET", `/cases/${caseId}/audit`),
};
