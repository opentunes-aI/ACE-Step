# ACE-Step Repository Review

## Overview
ACE-Step is an open-source foundation model for music generation, designed as a "Stable Diffusion moment for music." It integrates diffusion-based generation with Sana's Deep Compression AutoEncoder (DCAE) and a lightweight linear transformer, using semantic alignment (REPA) with models like MERT and m-HuBERT for rapid convergence. It generates up to 4 minutes of music in ~20 seconds on an A100 GPU (15× faster than LLM baselines), with superior coherence, lyric alignment, and acoustic details.

Co-led by ACE Studio and StepFun, with models available on Hugging Face and ModelScope.

## Model Availability
The repository **does not include the actual model weights** (e.g., the ~3.5B parameter ACE-Step transformer). Instead:
- Models are hosted on Hugging Face (`ACE-Step/ACE-Step-v1-3.5B`) and auto-downloaded on first run via `huggingface_hub`.
- Specify `--checkpoint_path` to load from a local directory (if models exist) or cache downloads there. Can be set to cloud-synced folders like Google Drive (e.g., `--checkpoint_path "/path/to/Google Drive/ACE-Step-Models"`).
- If no path is set, downloads to `~/.cache/ace-step/checkpoints`.
- Quantized versions available (e.g., `-q4-K-M`).
- No external API needed beyond initial download; runs locally afterward.
- **Size**: ~3.5B parameters; main transformer ~7GB (FP16), total download ~10-15GB (includes DCAE, vocoder, text encoder). Quantized: ~3-5GB. VRAM: 8GB max with `--cpu_offload true`.

## Purpose and Capabilities
- **Supports**: Diverse styles/genres, 19 languages (top: English, Chinese, Russian, Spanish, etc.), instrumental music, vocal techniques.
- **Features**: Baseline quality across genres/languages; controllability via variations, repainting, lyric editing; applications like Lyric2Vocal (LoRA for vocal demos) and Text2Samples (for instrument loops); upcoming RapMachine and StemGen.
- **Use Cases**: Creative production (compose tracks/demos/remixes), education/entertainment, tools for artists (vocal guides, samples), research (train custom LoRAs/ControlNets).
- **Emphasis**: Responsible use with disclaimers on copyright, cultural sensitivity, and harmful content.

## Installation
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/ace-step/ACE-Step.git
   cd ACE-Step
   ```

2. **Set Up Environment** (Python 3.10+ recommended):
   - Conda: `conda create -n ace_step python=3.10 -y && conda activate ace_step`
   - Venv: `python -m venv venv && source venv/bin/activate` (adjust for OS).

3. **Install Dependencies**:
   - GPU (Windows): `pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126`
   - Core: `pip install -e .`
   - Training: `pip install -e .[train]`

## Usage

### GUI (Basic)
- Run: `acestep --port 7865`
- Browser: `http://127.0.0.1:7865`
- Tabs: Text2Music (input tags/lyrics/duration), Retake (variations), Repainting (edit sections), Edit (modify tags/lyrics), Extend (add to tracks).
- Options: `--checkpoint_path` (auto-download), `--bf16 true`, `--cpu_offload true`, `--torch_compile true`. macOS: `--bf16 false`.

### API (Python)
- Install: `pip install git+https://github.com/ace-step/ACE-Step.git`
- Example:
  ```python
  from acestep.pipeline_ace_step import ACEStepPipeline

  pipeline = ACEStepPipeline(checkpoint_dir="path/to/checkpoints")
  audio = pipeline(
      audio_duration=60,
      prompt="energetic pop, female vocal, upbeat",
      lyrics="[Verse]\nSample lyrics here",
      infer_step=27,
      guidance_scale=7.5,
      save_path="output.wav"
  )
  ```
- Params: scheduler, CFG, ERG, seeds, etc. See `infer.py`/`infer-api.py`.

### Training
- Data: For each audio, need `filename.mp3`, `filename_prompt.txt` (tags), `filename_lyrics.txt` (optional).
- Follow `TRAIN_INSTRUCTION.md`: Data format, scripts (`trainer.py`), LoRA fine-tuning.
- Example: Train base model or LoRAs (e.g., RapMachine).

## Hardware Requirements
- Recommended: NVIDIA GPU (RTX 4090 fast inference; A100 training).
- VRAM: 8GB max with `--cpu_offload true`.
- Performance: 27.27× RTF on A100 (1 min audio in 2.2s at 27 steps).

## Resources
- README.md: Full details, features, roadmap.
- Hugging Face Space: Demos.
- Discord: Community support.
- TRAIN_INSTRUCTION.md: Training guide.
- Examples: `examples/input_params/` for sample inputs.