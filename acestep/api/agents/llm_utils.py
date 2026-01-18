from smolagents import LiteLLMModel
import os

def get_llm_model():
    """
    Returns a configured LiteLLMModel based on environment variables.
    Handles both Ollama (local) and Cloud (OpenAI/Anthropic) configurations.
    """
    model_id = os.getenv("AGENT_MODEL_ID", "ollama/qwen2.5:3b")
    api_base = os.getenv("OLLAMA_API_BASE") # None by default implies no custom base (Cloud)

    # Check for Ollama-specific configuration
    is_ollama = "ollama" in model_id.lower()
    
    if is_ollama:
        # Default to localhost if not specified
        if not api_base:
            api_base = "http://localhost:11434"
        print(f"[Agent] Using Local Ollama: {model_id} at {api_base}")
        return LiteLLMModel(model_id=model_id, api_base=api_base)
    
    # For OpenAI/Cloud models
    # Ensure OPENAI_API_KEY is available in env if using gpt models
    print(f"[Agent] Using Cloud Model: {model_id}")
    return LiteLLMModel(model_id=model_id)
