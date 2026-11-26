import json
from functools import lru_cache
from pathlib import Path
from app.models import ChatResponse, Language

KB_PATH = Path(__file__).parent / "knowledge_base.json"


@lru_cache(maxsize=1)
def _load_kb() -> dict:
    return json.loads(KB_PATH.read_text(encoding="utf-8"))


def answer_question(message: str, language: Language) -> ChatResponse:
    """Deterministic, high-precision bilingual assistant backed by curated safety KB."""
    kb = _load_kb()
    text = message.strip().lower()

    best_intent = None
    best_score = 0

    for intent in kb["intents"]:
        score = sum(len(kw) for kw in intent["keywords"] if kw in text)
        if score > best_score:
            best_score = score
            best_intent = intent

    target = best_intent if best_intent is not None else kb["fallback"]
    return ChatResponse(
        reply=target["reply_bn"] if language == "bn" else target["reply_en"],
        intent_id=target["id"] if best_intent is not None else "fallback",
        suggested_link=target.get("suggested_link"),
        suggested_label=(
            target.get("suggested_label_bn")
            if language == "bn"
            else target.get("suggested_label_en")
        ),
    )
