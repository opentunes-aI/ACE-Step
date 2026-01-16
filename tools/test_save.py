
import os
import torch
import torchaudio
import time

def test_save():
    output_dir = "./outputs"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    filename = f"test_{int(time.time())}.wav"
    filepath = os.path.join(output_dir, filename)
    
    print(f"Attempting to save to {filepath}...")
    
    # Create dummy audio
    sample_rate = 32000
    waveform = torch.zeros((1, 32000)) # 1 second of silence
    
    try:
        import soundfile as sf
        sf.write(filepath, waveform.t().numpy(), sample_rate)
        print("Success with soundfile directly!")
        print(f"File exists: {os.path.exists(filepath)}")
    except Exception as e:
        print(f"Failed with soundfile: {e}")

    try:
        torchaudio.save(filepath, waveform, sample_rate, backend="soundfile")
        print("Success with torchaudio!")
    except Exception as e:
        print(f"Failed with torchaudio: {e}")

if __name__ == "__main__":
    test_save()
