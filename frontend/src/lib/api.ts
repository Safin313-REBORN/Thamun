export type Language = "en" | "bn";
export type Label = "safe" | "risky" | "compromised";

export interface ScriptStep {
  id: string;
  caller_line_en: string;
  caller_line_bn: string;
  tactic_hint: string;
  allowed_next_ids: string[];
  is_terminal: boolean;
}

export interface Scenario {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string;
  summary_en: string;
  summary_bn: string;
  caller_role_en: string;
  caller_role_bn: string;
  root_step_id: string;
  steps: Record<string, ScriptStep>;
}

export interface ClassifyResponse {
  label: Label;
  tactic: string;
  reason: string;
  next_step_id: string;
  confidence: number;
  provider: "gemini" | "rules";
  used_fallback: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchScenario(scenarioId: string): Promise<Scenario> {
  const res = await fetch(`${API_BASE}/api/scenarios/${encodeURIComponent(scenarioId)}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Could not load practice scenario.");
  }
  return res.json();
}

export async function classifyReply(payload: {
  scenario_id: string;
  step_id: string;
  user_reply: string;
  language: Language;
}): Promise<ClassifyResponse> {
  const res = await fetch(`${API_BASE}/api/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Classification failed" }));
    throw new Error(err.detail || "Classification failed");
  }
  return res.json();
}

export interface ChatResponse {
  reply: string;
  intent_id: string;
  suggested_link?: string | null;
  suggested_label?: string | null;
}

export async function sendChatMessage(payload: {
  message: string;
  language: Language;
}): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Could not reach helper" }));
    throw new Error(err.detail || "Could not reach helper");
  }
  return res.json();
}
