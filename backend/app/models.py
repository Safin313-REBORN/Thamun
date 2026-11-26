from typing import Literal
from pydantic import BaseModel, Field

Label = Literal["safe", "risky", "compromised"]
Tactic = Literal[
    "urgency",
    "authority",
    "secrecy",
    "otp_harvest",
    "prize_lure",
    "advance_fee",
    "none",
]
Language = Literal["en", "bn"]


class ScriptStep(BaseModel):
    id: str
    caller_line_en: str
    caller_line_bn: str
    tactic_hint: Tactic
    allowed_next_ids: list[str]
    is_terminal: bool = False


class Scenario(BaseModel):
    id: str
    slug: str
    title_en: str
    title_bn: str
    summary_en: str
    summary_bn: str
    caller_role_en: str
    caller_role_bn: str
    root_step_id: str
    steps: dict[str, ScriptStep]


class ScenarioSummary(BaseModel):
    id: str
    slug: str
    title_en: str
    title_bn: str
    summary_en: str
    summary_bn: str
    caller_role_en: str
    caller_role_bn: str
    root_step_id: str


class ClassifyRequest(BaseModel):
    scenario_id: str = Field(min_length=1, max_length=64)
    step_id: str = Field(min_length=1, max_length=64)
    user_reply: str = Field(min_length=1, max_length=500)
    language: Language = "en"


class ClassifyResponse(BaseModel):
    label: Label
    tactic: Tactic
    reason: str
    next_step_id: str
    confidence: float = Field(ge=0.0, le=1.0)
    provider: Literal["gemini", "rules"] = "rules"
    used_fallback: bool = False


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=400)
    language: Language = "en"


class ChatResponse(BaseModel):
    reply: str
    intent_id: str
    suggested_link: str | None = None
    suggested_label: str | None = None
