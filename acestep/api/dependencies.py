
import logging
from acestep.pipeline_ace_step import ACEStepPipeline

logger = logging.getLogger("ace_step_api")

class ModelManager:
    _instance = None
    pipeline = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
        return cls._instance

    def load_model(self, checkpoint_path=None):
        if self.pipeline is not None:
            logger.info("Model already loaded.")
            return

        logger.info(f"Loading ACE-Step model from {checkpoint_path}...")
        try:
            # Initialize the pipeline
            # Note: We might need to pass arguments like device_id, dtype etc.
            # For now using defaults or env vars could be an option
            self.pipeline = ACEStepPipeline(
                checkpoint_dir=checkpoint_path,
                dtype="bfloat16",  # Default from gui.py
                torch_compile=False,
                cpu_offload=True # Enabled for 8GB VRAM GPUs
            )
            logger.info("Model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise e

    def get_pipeline(self):
        if self.pipeline is None:
            raise RuntimeError("Model not initialized. Call load_model() first.")
        return self.pipeline

# Singleton instance
manager = ModelManager()
