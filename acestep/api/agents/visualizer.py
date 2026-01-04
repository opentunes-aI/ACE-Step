from smolagents import CodeAgent, LiteLLMModel, tool
from typing import Dict, Any
import urllib.parse
import os

OLLAMA_URL = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
model = LiteLLMModel(model_id="ollama/qwen2.5:3b", api_base=OLLAMA_URL)

@tool
def generate_cover_art(description: str) -> Dict[str, Any]:
    """
    Generates a cover image URL using Pollinations.ai.

    Args:
        description: A visual description (e.g. "Cyberpunk city, neon lights").
    """
    encoded = urllib.parse.quote(description)
    url = f"https://image.pollinations.ai/prompt/{encoded}"
    return {
        "action": "generate_cover_art",
        "params": { "image_url": url, "description": description }
    }

visualizer_agent = CodeAgent(
    tools=[generate_cover_art],
    model=model,
    add_base_tools=False,
    description="You are a Visual Director. Create stunning cover art descriptions matching the music's vibe."
)
