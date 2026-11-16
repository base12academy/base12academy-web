import { supabase } from "@/lib/supabaseClient";
import type { Opo12AttemptMode } from "./config";

export type Opo12Access = {
  state: "active" | "restricted" | "cancelled";
  regularizationDaysRemaining: number | null;
  complimentary: boolean;
  paidThrough: string | null;
  purgeDueAt: string | null;
  canStart: boolean;
  canViewSolutions: boolean;
};

export type Opo12AttemptSummary = {
  id: string;
  mode: Opo12AttemptMode;
  configuration: Record<string, unknown>;
  status: "preparing" | "in_progress" | "submitted" | "expired" | "invalidated" | "abandoned";
  started_at: string;
  deadline_at: string | null;
  submitted_at: string | null;
  score: number | null;
  score_snapshot: Record<string, unknown> | null;
};

export type Opo12Overview = {
  profile: {
    slug: string;
    name: string;
    shortName: string;
    callLabel: string;
    durationMinutes: number;
  };
  access: Opo12Access;
  includedModes: Opo12AttemptMode[];
  activeAttempt: Opo12AttemptSummary | null;
  history: Opo12AttemptSummary[];
  incidents: Array<{ id: string; category: string; status: string; created_at: string; resolved_at: string | null }>;
};

export type Opo12AttemptQuestion = {
  position: number;
  block: "theory" | "practical";
  is_reserve: boolean;
  reserve_order: number | null;
  topic_code: string;
  prompt: string;
  options: unknown;
};

export type Opo12SavedAnswer = {
  position: number;
  selected_option: "A" | "B" | "C" | "D" | null;
  flagged: boolean;
  saved_at: string;
};

export type Opo12Solution = {
  position: number;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string;
  official_reference: string;
  reviewed_on: string;
  annulled: boolean;
};

export type Opo12AttemptPayload = {
  attempt: Opo12AttemptSummary;
  questions: Opo12AttemptQuestion[];
  answers: Opo12SavedAnswer[];
  solutions?: Opo12Solution[];
  solutionsLocked?: boolean;
  purgedAfterDelivery?: boolean;
};

export class Opo12ApiError extends Error {
  status: number;
  details: Record<string, unknown>;

  constructor(status: number, details: Record<string, unknown>) {
    super(String(details.error || "opo12_request_failed"));
    this.name = "Opo12ApiError";
    this.status = status;
    this.details = details;
  }
}

async function authorizationHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Opo12ApiError(401, { error: "login_required" });
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const auth = await authorizationHeaders();
  const response = await fetch(path, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...auth,
      ...init.headers,
    },
  });
  const data = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok || response.status === 202) throw new Opo12ApiError(response.status, data);
  return data as T;
}

async function waitForPreparedAttempt(attemptId: string, retries = 6): Promise<Opo12AttemptPayload> {
  for (let retry = 0; retry < retries; retry += 1) {
    try {
      return await request<Opo12AttemptPayload>(`/api/opo12/attempt?id=${encodeURIComponent(attemptId)}`);
    } catch (error) {
      if (!(error instanceof Opo12ApiError) || error.status !== 202 || retry === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 + retry * 250));
    }
  }
  throw new Opo12ApiError(503, { error: "attempt_preparation_timeout" });
}

export function loadOpo12Overview() {
  return request<Opo12Overview>("/api/opo12/overview");
}

export async function startOpo12Attempt(input: {
  mode: Opo12AttemptMode;
  questionCount?: number;
  topicCodes?: string[];
}): Promise<Opo12AttemptPayload> {
  try {
    return await request<Opo12AttemptPayload>("/api/opo12/attempt", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (error) {
    if (error instanceof Opo12ApiError && error.status === 202 && typeof error.details.attemptId === "string") {
      return waitForPreparedAttempt(error.details.attemptId);
    }
    throw error;
  }
}

export function loadOpo12Attempt(attemptId: string) {
  return waitForPreparedAttempt(attemptId);
}

export function saveOpo12Answer(input: {
  attemptId: string;
  position: number;
  selectedOption: string | null;
  flagged: boolean;
}) {
  return request<{ saved: true; savedAt: string }>("/api/opo12/attempt", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function submitOpo12Attempt(attemptId: string) {
  return request<Opo12AttemptPayload>("/api/opo12/attempt", {
    method: "PUT",
    body: JSON.stringify({ attemptId }),
  });
}

export function abandonOpo12Attempt(attemptId: string) {
  return request<{ abandoned: boolean; status?: string }>("/api/opo12/attempt", {
    method: "DELETE",
    body: JSON.stringify({ attemptId }),
  });
}

export function createOpo12Incident(input: {
  category: "question" | "technical" | "subscription" | "other";
  description: string;
  attemptId?: string | null;
  position?: number | null;
}) {
  return request<{ incident: { id: string; status: string; created_at: string } }>("/api/opo12/incidents", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
