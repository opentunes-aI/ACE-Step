
import httpx
import sys

def check_status():
    job_id = "95554d0b-65c8-44c8-a7d7-d7d0b15ba8fb"
    try:
        r = httpx.get(f"http://127.0.0.1:8000/status/{job_id}")
        data = r.json()
        print(data)
    except Exception as e:
        print(e)

if __name__ == "__main__":
    check_status()
