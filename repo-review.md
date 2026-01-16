# Opentunes Repository Review (Rebuild Branch)

## 1. Project Overview & Context
**Current Branch**: `rebuild/infra-revamp`
**Status**: Active SaaS Application Development ("Opentunes.ai")
**Previous State**: Foundation Model Repository (`main` branch)

The repository has transitioned from a pure research/model codebase (ACE-Step Foundation Model) into a full-stack SaaS application ("Opentunes Studio"). The `rebuild/infra-revamp` branch focuses on infrastructure, agentic workflows, and a modern web studio interface.

---

## 2. Architecture Review

### 2.1 Backend (`acestep/api`)
- **Framework**: FastAPI (Async) with `uvicorn`.
- **Agent Framework**: `smolagents` (Hugging Face) + `LiteLLM` (Ollama/Qwen).
- **Orchestration**: Hub-and-Spoke pattern. `DirectorAgent` delegates to `Producer` (Audio), `Lyricist` (Text), `Visualizer` (Image), and `Critic` (Review).
- **Communication**: Shared memory via `asyncio.gather` for parallel tasks and `StreamingResponse` (NDJSON) for real-time frontend updates.
- **RAG**: Built-in `RAGEngine` using `sentence-transformers` (Local) and Supabase `pgvector` (Remote).
- **Storage**: Hybrid "Dual Write" system (Local Disk + Supabase Storage).

### 2.2 Frontend (`acestep_studio`)
- **Framework**: Next.js 14 (App Router).
- **Styling**: TailwindCSS + Glassmorphism aesthetic ("Deep Space" theme).
- **State Management**: `zustand` (`useStudioStore`).
- **Real-time Interaction**: `AgentChat` component parses streamed NDJSON to render "Living Studio" logs and trigger side effects (e.g., updating UI controls).

---

## 3. Current Development Status

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Infrastructure** | ✅ Complete | Docker, Env Config, Supabase connection. |
| **Studio UI** | ✅ Complete | Sidebar, Control Panel, Waveform, Glass Theme. |
| **Agent Core** | ✅ Complete | Director, Producer, Lyricist, Critic, Visualizer wired up. |
| **RAG System** | ✅ Complete | Audio/Lyric indexing and retrieval active. |
| **Audio Gen** | ⚠️ Partial | Pipeline integrated, but inference relies on local GPU/Checkpoints. |
| **Authentication** | ⚠️ Partial | UI elements exist (`LoginCard`), but strict middleware/protection pending `feat/saas-architecture`. |

---

## 4. Code Analysis (Deep Dive)

### 4.1 The Agent System (`acestep/api/agents`)
- **Director (`director.py`)**: Successfully implements intent analysis and parallel delegation. Uses a robust `asyncio` loop to manage sub-agents. JSON parsing relies on a custom `extract_json_from_text` helper which handles markdown code blocks well but could be brittle.
- **Visualizer (`visualizer.py`)**: Currently uses `pollinations.ai` for rapid prototyping.
- **Protocol**: The NDJSON streaming format (`type`, `step`, `message`) is well-structured for the frontend.

### 4.2 The Studio Client (`acestep_studio`)
- **AgentChat.tsx**: A complex, monolithic component (~460 lines). It handles UI rendering, stream parsing, and side-effect dispatching.
    - *Good*: Responsive UI, handles "Thinking" states, nice typewriter effects.
    - *Risk*: State logic is tightly coupled with rendering.

### 4.3 Database & RAG
- **RAG Engine (`rag.py`)**: Singleton pattern. Loads `all-MiniLM-L6-v2` on startup. This ensures fast queries but increases initial RAM usage/startup time.
- **Supabase**: Used for vector search (`match_agent_memory` RPC) and file storage.

---

## 5. Optimization Suggestions

### 5.1 Critical
1.  **JSON Robustness**: The regex-based JSON extraction in `director.py` is a potential failure point for less capable LLMs. *Suggestion*: Use structured outputs (if supported by backend) or a dedicated parser library like `pydantic` with retry logic.
2.  **RAG Cold Start**: `RAGEngine` initializes the transformer model synchronously during API startup (`lifespan`). *Suggestion*: Move model loading to a background thread or lazy input to prevent worker timeouts on slow machines.

### 5.2 Architecture
3.  **Component Refactoring**: Split `AgentChat.tsx`.
    - `ChatStreamParser.ts`: Handle the decoding and side-effect logic.
    - `MessageBubble.tsx`: Isolated component for rendering messages.
4.  **Environment Config**: High-level constants (e.g., Model ID `qwen2.5:3b`, Embedding Model) are hardcoded in python files. *Suggestion*: Move all model identifiers to `.env` to allow easy swapping (e.g., strictly for VRAM constrained users).

### 5.3 Security
5.  **Supabase Keys**: Checks for `NEXT_PUBLIC_SUPABASE_ANON_KEY`. For backend operations (Writing to Storage), ensure `SUPABASE_SERVICE_ROLE_KEY` is strictly used and never exposed to the client.

## 6. Branch Comparison Note
- **Rebuild Branch**: Contains the active SaaS code.
- **Main Branch**: Likely retains legacy model training code.
- **Recommendation**: Merge `rebuild` into `main` only after full validation of the Generation Pipeline in the cloud context.