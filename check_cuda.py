import torch
import sys
import os

print(f"Python: {sys.version}")
print(f"Python Executable: {sys.executable}")
print(f"Torch: {torch.__version__}")
print(f"Torch File: {torch.__file__}")
try:
    print(f"CUDA available: {torch.cuda.is_available()}")
    print(f"CUDA version: {torch.version.cuda}")
    print(f"Device count: {torch.cuda.device_count()}")
    if torch.cuda.is_available():
        print(f"Current device: {torch.cuda.get_device_name(0)}")
except Exception as e:
    print(f"Error checking CUDA: {e}")
