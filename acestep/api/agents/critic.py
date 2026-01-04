from smolagents import CodeAgent, LiteLLMModel
import os

OLLAMA_URL = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
AGENT_MODEL = os.getenv("AGENT_MODEL_ID", "ollama/qwen2.5:3b")
model = LiteLLMModel(model_id=AGENT_MODEL, api_base=OLLAMA_URL)

critic_agent = CodeAgent(
    tools=[], 
    model=model,
    add_base_tools=False,
    description="You are a Quality Control Critic. You review music/lyric plans against user intent. Be strict but constructive."
)
