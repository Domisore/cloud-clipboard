import requests
import json
import sys

# Configuration
API_URL = "http://localhost:3000/api/v1/clips"

def test_create_clip():
    print(f"Testing {API_URL}...")
    
    payload = {
        "content": "This is a test clip from the verification script.",
        "title": "Verification Clip",
        "isPrivate": True
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                clip_data = data.get("data", {})
                url = clip_data.get("url")
                print(f"✅ Success! Clip created.")
                print(f"ID: {clip_data.get('id')}")
                print(f"URL: {url}")
                
                # Verification logic for URL format
                if "/c/" not in url and url.startswith("http"):
                     print("✅ URL format verification PASSED (No /c/ prefix found).")
                else:
                     print("❌ URL format verification FAILED (Contains /c/ or invalid format).")
            else:
                print(f"❌ API returned success=false: {data}")
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection refused. Is the development server running on localhost:3000?")

if __name__ == "__main__":
    test_create_clip()
