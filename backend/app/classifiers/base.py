import re
from abc import ABC, abstractmethod
from app.models import ClassifyResponse, Language, Scenario, ScriptStep

_BANGLA_DIGITS = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")

_SENSITIVE_PATTERNS = [
    re.compile(r"\b\d{4,6}\b"),  # PIN or OTP
    re.compile(r"\b(?:\+?880|0)1[3-9]\d{8}\b"),  # BD mobile number
    re.compile(r"\b(?:\d[ -]?){13,19}\b"),  # Card number
]


def normalize_digits(text: str) -> str:
    return text.translate(_BANGLA_DIGITS)


def contains_sensitive_pattern(text: str) -> bool:
    """Defense-in-depth check for PIN, OTP, phone, or card numbers."""
    normalized = normalize_digits(text)
    return any(pattern.search(normalized) for pattern in _SENSITIVE_PATTERNS)


class ClassifierProvider(ABC):
    @abstractmethod
    async def classify(
        self,
        scenario: Scenario,
        step: ScriptStep,
        user_reply: str,
        language: Language,
    ) -> ClassifyResponse:
        raise NotImplementedError
