from app.classifiers.base import ClassifierProvider
from app.models import ClassifyResponse, Language, Scenario, ScriptStep

_COMPROMISED_KEYWORDS = (
    "here is",
    "my code",
    "my pin",
    "otp is",
    "the code is",
    "sending",
    "take it",
    "ok take",
    "দিচ্ছি",
    "নিয়ে নিন",
    "নেন",
    "বলছি",
    "কোডটা হলো",
    "পিনটা হলো",
    "debo",
    "dicchi",
    "nin",
    "code ta holo",
)

_SAFE_REFUSAL_KEYWORDS = (
    "hang up",
    "hanging up",
    "bye",
    "goodbye",
    "cut the call",
    "no code",
    "no pin",
    "won't share",
    "will not share",
    "not sharing",
    "never share",
    "official app",
    "call back",
    "scam",
    "fraud",
    "fake",
    "কেটে দিচ্ছি",
    "রাখছি",
    "দেবো না",
    "দিব না",
    "বলবো না",
    "কোড দেবো না",
    "পিন দেবো না",
    "প্রতারণা",
    "ভুয়া",
    "অফিসে যাবো",
    "যাচাই",
    "debo na",
    "dibo na",
    "bolbo na",
    "rakchi",
    "kono code",
)

_QUESTIONING_KEYWORDS = (
    "why",
    "who are you",
    "which office",
    "prove",
    "কেন",
    "আপনি কে",
    "কোন অফিস",
    "keno",
    "apni ke",
)


def _pick_escalation_next(step: ScriptStep) -> str:
    for candidate in step.allowed_next_ids:
        if "terminal" not in candidate:
            return candidate
    if "step_terminal_safe_hangup" in step.allowed_next_ids:
        return "step_terminal_safe_hangup"
    return step.allowed_next_ids[0] if step.allowed_next_ids else step.id


def _pick_terminal(step: ScriptStep, target: str) -> str:
    if target in step.allowed_next_ids:
        return target
    return _pick_escalation_next(step)


class RuleClassifier(ClassifierProvider):
    """Deterministic keyword classifier for English, Bangla, and Banglish."""

    async def classify(
        self,
        scenario: Scenario,
        step: ScriptStep,
        user_reply: str,
        language: Language,
    ) -> ClassifyResponse:
        text = user_reply.strip().lower()

        if any(kw in text for kw in _COMPROMISED_KEYWORDS):
            reason = (
                "অনুশীলনে আপনি কোড বা পিন দিতে রাজি হয়েছেন। আসল কলে কখনোই দেবেন না।"
                if language == "bn"
                else "You agreed to share a code or PIN. Never share codes on a real call."
            )
            return ClassifyResponse(
                label="compromised",
                tactic=step.tactic_hint,
                reason=reason,
                next_step_id=_pick_terminal(step, "step_terminal_compromised"),
                confidence=0.88,
                provider="rules",
                used_fallback=False,
            )

        if any(kw in text for kw in _SAFE_REFUSAL_KEYWORDS):
            reason = (
                "ভালো সিদ্ধান্ত! আপনি কোড না দিয়ে কল শেষ করার বা যাচাই করার পথে গেছেন।"
                if language == "bn"
                else "Good move—you refused to share a code and moved to end or verify."
            )
            return ClassifyResponse(
                label="safe",
                tactic=step.tactic_hint,
                reason=reason,
                next_step_id=_pick_terminal(step, "step_terminal_safe_hangup"),
                confidence=0.90,
                provider="rules",
                used_fallback=False,
            )

        if any(kw in text for kw in _QUESTIONING_KEYWORDS):
            reason = (
                "আপনি প্রশ্ন করেছেন—ভালো। তবে প্রতারক চাপে ফেললে কল কেটে দিন।"
                if language == "bn"
                else "You questioned the caller, which slows them down. Hang up if they keep pushing."
            )
            return ClassifyResponse(
                label="safe",
                tactic=step.tactic_hint,
                reason=reason,
                next_step_id=_pick_escalation_next(step),
                confidence=0.76,
                provider="rules",
                used_fallback=False,
            )

        reason = (
            "চাপের মুখে কলে থাকা ঝুঁকিপূর্ণ। স্পষ্টভাবে না বলুন বা কল কেটে দিন।"
            if language == "bn"
            else "Staying on the line under pressure is risky. Refuse clearly or hang up."
        )
        return ClassifyResponse(
            label="risky",
            tactic=step.tactic_hint,
            reason=reason,
            next_step_id=_pick_escalation_next(step),
            confidence=0.72,
            provider="rules",
            used_fallback=False,
        )
