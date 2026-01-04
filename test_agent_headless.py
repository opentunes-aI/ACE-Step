import requests
import json
import sys

API_URL = "http://127.0.0.1:8000"

def test_agent_chat():
    print(f"Testing Agent Chat at {API_URL}...")
    
    payload = {
        "message": "Make a cyberpunk track about AI",
        "history": []
    }
    
    try:
        # Use stream=True to handle NDJSON
        with requests.post(f"{API_URL}/agent/chat", json=payload, stream=True) as r:
            if r.status_code != 200:
                print(f"❌ API Error: {r.status_code} - {r.text}")
                return False
            
            print("✅ Connection Established. Reading Stream...")
            
            logs = []
            final_plan = None
            
            for line in r.iter_lines():
                if line:
                    data = json.loads(line.decode('utf-8'))
                    # Print types for debug
                    print(f"   -> Received: {data.get('type')} from {data.get('step', 'Unknown')}")
                    
                    if data.get('type') == 'plan':
                        final_plan = data.get('plan')
                    
                    logs.append(data)
            
            if not logs:
                print("❌ No data received from stream.")
                return False
                
            if final_plan:
                print(f"✅ Plan Received: {final_plan}")
            else:
                print("⚠️ No explicit Plan object (Legacy format?).")

            # Check for Producer config (Robustness check)
            has_config = any(
                log.get('action') == 'configure' or 
                (log.get('type') == 'result' and any(d.get('action') == 'configure' for d in log.get('data', [])))
                for log in logs
            )
            
            if has_config:
                print("✅ robust JSON parsing success: 'Producer' returned valid config.")
            else:
                print("⚠️ Producer did not configure. might be mock/stubbed.")
                
            return True

    except Exception as e:
        print(f"❌ Request Failed: {e}")
        return False

if __name__ == "__main__":
    success = test_agent_chat()
    sys.exit(0 if success else 1)
