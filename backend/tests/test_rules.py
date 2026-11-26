import pytest
from app.classifiers.base import contains_sensitive_pattern
from app.classifiers.rules import RuleClassifier
from app.scenarios.loader import load_scenarios


@pytest.mark.parametrize(
    "text,expected",
    [
        ("1234", True),
        ("My OTP is 482910", True),
        ("আমার পিন ১২৩৪", True),
        ("Call me at 01712345678", True),
        ("4532 1234 5678 9012", True),
        ("Why would my account close?", False),
        ("কেন বন্ধ হবে?", False),
    ],
)
def test_sensitive_pattern_detection(text: str, expected: bool):
    assert contains_sensitive_pattern(text) is expected


@pytest.mark.anyio
async def test_rule_classifier_safe_bangla_question():
    scenario = load_scenarios()["takapay-support"]
    step = scenario.steps[scenario.root_step_id]
    res = await RuleClassifier().classify(scenario, step, "কেন বন্ধ হবে?", "bn")
    assert res.label == "safe"
    assert res.next_step_id == "step_2_otp"


@pytest.mark.anyio
async def test_rule_classifier_refusal_ends_safely():
    scenario = load_scenarios()["takapay-support"]
    step = scenario.steps["step_2_otp"]
    res = await RuleClassifier().classify(scenario, step, "I will not share any code, hanging up.", "en")
    assert res.label == "safe"
    assert res.next_step_id == "step_terminal_safe_hangup"


@pytest.mark.anyio
async def test_rule_classifier_compromised():
    scenario = load_scenarios()["takapay-support"]
    step = scenario.steps["step_2_otp"]
    res = await RuleClassifier().classify(scenario, step, "Okay, sending my code now", "en")
    assert res.label == "compromised"
    assert res.next_step_id == "step_terminal_compromised"
