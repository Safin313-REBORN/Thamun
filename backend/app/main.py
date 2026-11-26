import time
import uuid
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.chatbot.assistant import answer_question
from app.classifiers.base import contains_sensitive_pattern
from app.classifiers.rules import RuleClassifier
from app.config import settings
from app.db import init_db
from app.models import (
    ChatRequest,
    ChatResponse,
    ClassifyRequest,
    ClassifyResponse,
    Scenario,
    ScenarioSummary,
)
from app.scenarios.loader import load_scenarios

_RATE_BUCKETS: dict[str, deque[float]] = defaultdict(deque)
_classifier = RuleClassifier()


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    load_scenarios()
    yield


app = FastAPI(title="THAMUN API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.middleware("http")
async def rate_limit_and_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())[:8]
    client_ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    bucket = _RATE_BUCKETS[client_ip]
    while bucket and now - bucket[0] > 60.0:
        bucket.popleft()
    if len(bucket) >= settings.rate_limit_per_minute:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please wait a moment.", "request_id": request_id},
        )
    bucket.append(now)
    response = await call_next(request)
    response.headers["X-Request-Id"] = request_id
    return response


@app.get("/api/health")
def health() -> dict[str, str | bool]:
    return {
        "status": "ok",
        "ai_configured": bool(settings.gemini_api_key),
        "version": "0.1.0",
    }


@app.get("/api/scenarios", response_model=list[ScenarioSummary])
def list_scenarios() -> list[ScenarioSummary]:
    scenarios = load_scenarios().values()
    return [
        ScenarioSummary(
            id=s.id,
            slug=s.slug,
            title_en=s.title_en,
            title_bn=s.title_bn,
            summary_en=s.summary_en,
            summary_bn=s.summary_bn,
            caller_role_en=s.caller_role_en,
            caller_role_bn=s.caller_role_bn,
            root_step_id=s.root_step_id,
        )
        for s in scenarios
    ]


@app.get("/api/scenarios/{scenario_id}", response_model=Scenario)
def get_scenario(scenario_id: str) -> Scenario:
    scenario = load_scenarios().get(scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario


@app.post("/api/classify", response_model=ClassifyResponse)
async def classify_reply(payload: ClassifyRequest) -> ClassifyResponse:
    # Defense-in-depth: block PIN/OTP/phone/card patterns without logging payload.user_reply
    if contains_sensitive_pattern(payload.user_reply):
        raise HTTPException(
            status_code=422,
            detail="For your safety, do not enter anything that looks like a PIN, OTP, phone, or card number.",
        )

    scenario = load_scenarios().get(payload.scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    step = scenario.steps.get(payload.step_id)
    if not step:
        raise HTTPException(status_code=404, detail="Script step not found")

    if step.is_terminal:
        raise HTTPException(status_code=400, detail="Call has already ended")

    return await _classifier.classify(scenario, step, payload.user_reply, payload.language)


@app.post("/api/chat", response_model=ChatResponse)
def chat_helper(payload: ChatRequest) -> ChatResponse:
    # Defense-in-depth: block PIN/OTP/phone/card patterns without logging payload.message
    if contains_sensitive_pattern(payload.message):
        raise HTTPException(
            status_code=422,
            detail="For your safety, do not enter anything that looks like a PIN, OTP, phone, or card number.",
        )
    return answer_question(payload.message, payload.language)
