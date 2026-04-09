const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API error: ${res.status}`);
  }

  return res.json();
}

// Cases
export const api = {
  cases: {
    list: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return fetchAPI<any>(`/api/v1/cases${query}`);
    },
    get: (id: string) => fetchAPI<any>(`/api/v1/cases/${id}`),
    create: (data: any) => fetchAPI<any>("/api/v1/cases", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchAPI<any>(`/api/v1/cases/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    history: (id: string) => fetchAPI<any[]>(`/api/v1/cases/${id}/history`),
    recommendations: (id: string) => fetchAPI<any[]>(`/api/v1/cases/${id}/recommendations`),
    notes: (id: string) => fetchAPI<any[]>(`/api/v1/cases/${id}/notes`),
    addNote: (id: string, data: any) => fetchAPI<any>(`/api/v1/cases/${id}/notes`, { method: "POST", body: JSON.stringify(data) }),
    action: (id: string, data: any) => fetchAPI<any>(`/api/v1/cases/${id}/actions`, { method: "POST", body: JSON.stringify(data) }),
  },
  policies: {
    list: () => fetchAPI<any[]>("/api/v1/policies"),
    get: (id: string) => fetchAPI<any>(`/api/v1/policies/${id}`),
  },
  tools: {
    execute: (data: any) => fetchAPI<any>("/api/v1/tools/execute", { method: "POST", body: JSON.stringify(data) }),
  },
  workflow: {
    run: (caseId: string) => fetchAPI<any>("/api/v1/workflow/run", { method: "POST", body: JSON.stringify({ case_id: caseId }) }),
    states: () => fetchAPI<any>("/api/v1/workflow/states"),
  },
  audit: {
    list: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return fetchAPI<any>(`/api/v1/audit${query}`);
    },
    tools: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return fetchAPI<any[]>(`/api/v1/audit/tools${query}`);
    },
  },
  metrics: {
    dashboard: () => fetchAPI<any>("/api/v1/metrics/dashboard"),
  },
  health: {
    check: () => fetchAPI<any>("/health"),
  },
};
