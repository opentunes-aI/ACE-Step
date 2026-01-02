from smolagents import CodeAgent, LiteLLMModel, tool
from typing import Optional, Dict, Any
import os

# 1. Define Tools
@tool
def configure_studio(
    prompt: str,
    steps: int,
    cfg_scale: float,
    duration: float,
    seed: Optional[int] = None
) -> Dict[str, Any]:
    """
    Configures the music studio with specific parameters.
    Args:
        prompt: The text prompt for generation. Be descriptive providing genre, mood, instrumentation.
        steps: Inference steps (20-100). Higher = better quality but slower. Standard is 50.
        cfg_scale: Guidance scale (3.0-20.0). Higher = follows prompt strictly. Creative is ~7.0. Strict is ~15.0.
        duration: Length in seconds (10-300).
        seed: Random seed (optional).
    """
    return {
        "action": "configure",
        "params": {
            "prompt": prompt,
            "steps": steps,
            "cfg_scale": cfg_scale,
            "duration": duration,
            "seed": seed
        }
    }

import urllib.parse

@tool
def update_lyrics(content: str) -> Dict[str, Any]:
    """
    Updates the studio lyric sheet.
    Args:
        content: The complete lyrics. MUST use structural tags like [Verse], [Chorus], [Bridge].
    """
    return {
        "action": "update_lyrics",
        "params": { "lyrics": content }
    }

@tool
def generate_cover_art(description: str) -> Dict[str, Any]:
    """
    Generates a cover image URL.
    Args:
        description: A detailed visual description (e.g. "Cyberpunk city, neon lights, digital art").
    """
    encoded = urllib.parse.quote(description)
    # Using Pollinations.ai for instant free generation
    url = f"https://image.pollinations.ai/prompt/{encoded}"
    return {
        "action": "generate_cover_art",
        "params": { "image_url": url, "description": description }
    }

# 2. Check for Ollama
# We assume localhost:11434 is running.
OLLAMA_URL = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")

model = LiteLLMModel(
    model_id="ollama/qwen2.5:3b",
    api_base=OLLAMA_URL
)

producer_agent = CodeAgent(
    tools=[configure_studio, update_lyrics, generate_cover_art],
    model=model,
    add_base_tools=False,
    additional_authorized_imports=["random"]
)

critic_agent = CodeAgent(
    tools=[],
    model=model,
    add_base_tools=False
)

def process_user_intent(user_input: str):
    """
    Orchestrates the Producer and Critic agents.
    """
    try:
        # 1. PRODUCER PHASE
        instruction = (
            f"USER REQUEST: '{user_input}'\n\n"
            "TASK: You are an Intelligent Studio Assistant (Producer, Lyricist, & Visualizer).\n"
            "RULES:\n"
            "1. IF USER WANTS MUSIC SETTINGS: Call 'configure_studio'.\n"
            "   - Expand the prompt creatively.\n"
            "2. IF USER WANTS LYRICS: Call 'update_lyrics'.\n"
            "   - Write creative lyrics with [Verse]/[Chorus].\n"
            "3. IF USER WANTS ART/IMAGES: Call 'generate_cover_art'.\n"
            "   - write a detailed visual prompt.\n"
            "4. MANDATORY TOOL CALL: You must call a tool.\n"
            "5. FINAL ANSWER: Return the exact JSON from the tool.\n"
        )
        
        print(f"Producer Processing: {user_input}") 
        response = producer_agent.run(instruction)
        print(f"Producer Response: {response}")

        # 2. CRITIC PHASE (Only for configuration)
        if isinstance(response, dict) and response.get("action") == "configure":
            params = response['params']
            critique_instruction = (
                f"ACT as a strict Music Studio Critic.\n"
                f"User Intent: '{user_input}'\n"
                f"Proposed Settings: {params}\n\n"
                "CHECKLIST:\n"
                "- Is the 'prompt' descriptive enough (>10 words)?\n"
                "- Are 'steps' appropriate (aim for 50+ normally)?\n"
                "- Does the vibe match the intent?\n\n"
                "OUTPUT:\n"
                "- If PASS: Return exactly 'APPROVED'.\n"
                "- If FAIL: Return a 1-sentence warning for the user.\n"
            )
            print("Critic Reviewing...")
            critique = critic_agent.run(critique_instruction)
            print(f"Critic Verdict: {critique}")
            
            if "APPROVED" not in str(critique).upper():
                # Block the config and warn user
                return {
                    "action": "critique_warning",
                    "message": f"⚠️ Critic Warning: {str(critique)}"
                }

        return response

    except Exception as e:
        print(f"Agent Execution Error: {e}")
        # Fallback
        return {
            "action": "error", 
            "message": str(e),
            "fallback": {"prompt": user_input} 
        }
