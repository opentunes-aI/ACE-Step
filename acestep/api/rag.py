import os
import logging
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client

logger = logging.getLogger(__name__)

class RAGEngine:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RAGEngine, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized: return
        
        logger.info("Initializing RAG Engine...")
        try:
            # Load Lightweight Model (384-dim)
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            
            # Connect to Supabase
            url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
            key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
            
            if url and key:
                self.supabase: Client = create_client(url, key)
                self._ready = True
                logger.info("RAG Engine Ready.")
            else:
                logger.warning("Supabase credentials missing. RAG Disabled.")
                self._ready = False
                
        except Exception as e:
            logger.error(f"RAG Init Failed: {e}")
            self._ready = False
        
        self._initialized = True

    def index_item(self, content: str, type: str, metadata: Dict[str, Any] = {}) -> bool:
        """
        Generates embedding and saves to 'agent_memory'.
        type: 'audio_prompt' | 'lyrics'
        """
        if not self._ready: return False
        
        try:
            embedding = self.model.encode(content).tolist()
            data = {
                "content": content,
                "type": type,
                "embedding": embedding,
                "metadata": metadata
            }
            self.supabase.table("agent_memory").insert(data).execute()
            logger.info(f"Indexed {type}: {content[:30]}...")
            return True
        except Exception as e:
            logger.error(f"Index Failed: {e}")
            return False

    def search(self, query: str, type_filter: str, limit: int = 3, threshold: float = 0.5) -> List[Dict]:
        """
        Uses RPC 'match_agent_memory' to find similar content.
        """
        if not self._ready: return []

        try:
            embedding = self.model.encode(query).tolist()
            params = {
                "query_embedding": embedding,
                "match_threshold": threshold,
                "match_count": limit,
                "filter_type": type_filter
            }
            res = self.supabase.rpc("match_agent_memory", params).execute()
            return res.data
        except Exception as e:
            logger.error(f"Search Failed: {e}")
            return []

# Singleton Instance
rag_engine = RAGEngine()
