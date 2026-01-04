from smolagents import CodeAgent, LiteLLMModel, tool
from typing import Dict, Any
from acestep.api.rag import rag_engine
import os

OLLAMA_URL = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
model = LiteLLMModel(model_id="ollama/qwen2.5:3b", api_base=OLLAMA_URL)

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
def search_lyrics_library(query: str) -> str:
    """
    Searches the Agent Memory for previous successful lyrics.
    Use this to understand rhyme schemes, vocabulary, and structure for the genre.
    
    Args:
        query: Search query for lyric style/content.
    """
    results = rag_engine.search(query, 'lyrics', limit=3)
    if not results:
        return "No relevant lyric examples found in memory."
    
    summary = "Found these successful lyric snippets:\n"
    for r in results:
        summary += f"- ...{r['content'][:200]}... (Similarity: {r['similarity']:.2f})\n"
    return summary

lyricist_agent = CodeAgent(
    tools=[update_lyrics, search_lyrics_library],
    model=model,
    add_base_tools=False,
    description="You are a professional Songwriter. Search the library for style references before writing new lyrics."
)
