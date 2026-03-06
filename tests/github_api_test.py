import urllib.request
import json
import os
import sys

# Load from environment for local testing
TOKEN = os.getenv("GITHUB_TOKEN")
REPO = os.getenv("GITHUB_REPO", "sohamrajput98/Trace-Ability")

# Pass the SHA as an argument or use your hardcoded one for this one-time test
COMMIT_SHA = sys.argv[1] if len(sys.argv) > 1 else "912985b360a4c15716e4a7ed4ab65220fce96bb2"

def test_github_comment():
    if not TOKEN:
        print("❌ ERROR: GITHUB_TOKEN environment variable not found.")
        print("Run: export GITHUB_TOKEN='your_token_here' (Linux/Mac) or set GITHUB_TOKEN=... (Windows)")
        return

    print(f"🚀 Testing GitHub API Integration for: {REPO}")
    
    url = f"https://api.github.com/repos/{REPO}/commits/{COMMIT_SHA}/comments"
    
    payload = {
        "body": "### ✅ Trace-Ability Integration Test\nThis comment confirms that the **GitHub API Connectivity** is successful. The AI engine is now authorized to post architectural insights to this repository."
    }
    
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    
    req.add_header("Authorization", f"token {TOKEN}")
    req.add_header("Accept", "application/vnd.github.v3+json")
    req.add_header("Content-Type", "application/json")
    req.add_header("User-Agent", "TraceAbility-Test-Script")

    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 201:
                print("\n✨ SUCCESS!")
                print(f"Comment posted successfully to commit {COMMIT_SHA[:7]}")
                print(f"Check it here: https://github.com/{REPO}/commit/{COMMIT_SHA}")
    except Exception as e:
        print(f"\n❌ API Error: {str(e)}")

if __name__ == "__main__":
    test_github_comment()