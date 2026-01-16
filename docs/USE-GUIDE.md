# ACE-Step User Guide (Legacy Gradio Interface)

> **Note**: This guide describes the legacy Gradio interface (`run_acestep.bat`). For the new Opentunes Studio interface (`run_studio.bat`), please refer to the main [README](../README.md).

This guide explains the components of the ACE-Step "text2music" interface and how to use them to generate and modify music.

## Interface Overview

The interface is divided into several sections:

-   **Model & Generation Controls**: Found at the top left.
-   **Audio Output**: Found at the top right.
-   **Input Parameters**: Text boxes for tags and lyrics.
-   **Settings**: Expandable sections for basic and advanced tuning.
-   **Workflow Tabs**: Specialized modes for Retake, Repainting, Editing, and Extending.

### 1. Main Generation Controls

Located at the top-left of the interface.

*   **Select previous generated input params**: A dropdown to load parameters from previously generated JSON files. Useful for recreating or tweaking a past result.
    *   *Action*: Select a file and click **Load** to populate all fields with that song's settings.
    *   *Note*: These files come from the `outputs/` folder. They are named automatically (e.g., `0_Example_Pop_Track_12345.json`). If this list is empty, it means you haven't generated anything yet. I've added a sample file for you to try!
*   **Audio Duration**: Slider to set the length of the track in seconds.
    *   *Value*: `-1` (default) means a random duration between 30 and 240 seconds.
*   **Format**: Dropdown to choose the output audio format (e.g., `wav`, `mp3`, `flac`, `ogg`).
    *   *Default*: `wav` (highest quality).
*   **Sample Button**: Generates a quick sample using the current settings (useful for testing LoRAs).

### 2. Audio2Audio & LoRA Settings

Located below the duration controls.

*   **Enable Audio2Audio**: Checkbox to enable generation based on a reference audio file.
    *   *Outcome*: When enabled, you can upload a "Reference Audio" file. The model will try to mimic the style or structure of this audio.
    *   *Strength*: A slider (`Ref Audio Strength`) appears to control how much influence the reference audio has (0.0 to 1.0).
*   **Lora Name or Path**: Dropdown to select a Low-Rank Adaptation (LoRA) model.
    *   *Example*: `ACE-Step/ACE-Step-v1-chinese-rap-LoRA`.
    *   *Outcome*: Applies a specific style fine-tuning (e.g., Chinese Rap) to your generation.
*   **Lora Weight**: Slider to control the intensity of the LoRA effect.
    *   *Range*: Typically `0.1` to `1.5`. Default is `1`.

### 3. Input Parameters (Tags & Lyrics)

The core creative inputs.

*   **Preset**: Quick start dropdown with genre templates (e.g., Pop, Rock, Hip Hop).
    *   *Action*: Selecting a preset automatically fills the "Tags" field.
*   **Tags**: A text box for descriptive keywords.
    *   *Format*: Comma-separated.
    *   *Example*: `funk, pop, soul, melodic, guitar, 105 BPM, energetic`
*   **Lyrics**: Text area for your song lyrics.
    *   *Structure*: Use square brackets for sections: `[verse]`, `[chorus]`, `[bridge]`, `[intro]`, `[outro]`.
    *   *Outcome*: The model attempts to align the generated vocals and melody with this structure.

### 4. Basic Settings

Click to expand.

*   **Infer Steps**: The number of diffusion steps.
    *   *Default*: `60`
    *   *Outcome*: Higher steps (e.g., 100+) generally yield higher quality but take longer. Lower steps are faster. 50-60 is a good balance.
*   **Guidance Scale**: Controls how strictly the model follows your text/lyric prompts.
    *   *Default*: `15.0`
    *   *Outcome*: Higher values force adherence to the prompt but can reduce diversity or audio quality if set too high.
*   **Guidance Scale Text / Lyric**: Separate scales for the text description vs. the lyrics.

### 5. Advanced Settings

For power users.

*   **Scheduler Type**: The algorithm used for generation.
    *   *Options*: `euler` (recommended), `heun`, `pingpong`.
*   **CFG Type**: Classifier-Free Guidance method.
    *   *Default*: `apg` (recommended).
*   **Seeds**: Manually set a seed for reproducible results. Leave blank for random.

### 6. Workflow Tabs (Bottom Right)

These tabs allow you to modify generated audio.

#### a. Retake
Regenerate a variation of the current track.
*   **Variance**: Slider (0.0 - 1.0) controlling how different the retake should be.
    *   *Low (0.1)*: Slight subtle changes.
    *   *High (0.8)*: Significant changes to melody/arrangement while keeping the core idea.

#### b. Repainting
Selectively re-generate a specific part of the song (e.g., fix a bad verse).
*   **Repaint Start / End Time**: Sliders to define the window (in seconds) to regenerate.
*   **Repaint Source**: Choose where the audio comes from (`text2music` output, `last_repaint`, or an uploaded file).

#### c. Edit
Modify the lyrics or style of an existing track.
*   **Edit Type**:
    *   `only_lyrics`: Kepp melody the same, change the words.
    *   `remix`: Change the melody/genre but arguably keep the same lyrics (or change them too).
*   **Edit Tags/Lyrics**: New inputs for the desired changes.

#### d. Extend
Continue a song beyond its current ending (or add an intro).
*   **Left / Right Extend Length**: How many seconds to add to the start or end.
*   **Extend Source**: The audio to extend.

## Getting Started

1.  **Select a Preset** (e.g., "Modern Pop") or type your own **Tags**.
2.  **Paste your Lyrics** (ensure you use `[verse]`/`[chorus]` tags).
3.  Click **Generate**.
4.  Wait for the audio to appear in the "Generated Audio" player.
5.  If you like it but want a tweak, use **Retake**.
6.  If one section is glitchy, use **Repainting** to fix just that part.

## Visual Feedback

*   **Status Indicator**: A status message under the "Parameters" section updates in real-time (e.g., "Starting generation...", "Generating music...").
*   **Progress Bar**: A toast notification ("Generation started!") appears at the top, and the "Generate" button changes to "Generating..." and disables to prevent double-clicks.
*   **Audio Spinner**: The audio player will show a loading spinner while the track is being created.

