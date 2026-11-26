import json
from functools import lru_cache
from pathlib import Path
from app.models import Scenario

SCRIPTS_PATH = Path(__file__).parent / "scripts.json"


@lru_cache(maxsize=1)
def load_scenarios() -> dict[str, Scenario]:
    raw = json.loads(SCRIPTS_PATH.read_text(encoding="utf-8"))
    scenarios = [Scenario.model_validate(item) for item in raw["scenarios"]]
    return {s.id: s for s in scenarios}
