
import httpx
import time
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_generation():
    print("Sending generation request...")
    payload = {
        "prompt": "short pulsing techno beat",
        "duration": 10.0,
        "infer_steps": 15 # Minimal steps for speed
    }
    
    try:
        resp = httpx.post(f"{BASE_URL}/generate", json=payload, timeout=10.0)
        resp.raise_for_status()
        data = resp.json()
        job_id = data["job_id"]
        print(f"Job queued: {job_id}")
    except Exception as e:
        print(f"Request failed: {e}")
        return

    # Poll status
    while True:
        try:
            r = httpx.get(f"{BASE_URL}/status/{job_id}", timeout=5.0)
            status_data = r.json()
            state = status_data["status"]
            progress = status_data.get("progress", 0.0)
            msg = status_data.get("message", "")
            
            print(f"Status: {state.upper()} | Progress: {progress*100:.1f}% | {msg}")
            
            if state in ["completed", "failed"]:
                print(f"Final Result: {status_data}")
                break
            
            time.sleep(2)
        except Exception as e:
            print(f"Polling failed: {e}")
            break

if __name__ == "__main__":
    test_generation()
