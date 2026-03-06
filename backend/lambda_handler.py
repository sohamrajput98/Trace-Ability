import json
import boto3
import os
import re
import time
import requests
from datetime import datetime, timezone
from botocore.exceptions import ClientError
from botocore.config import Config
from decimal import Decimal

# --- CONFIGURATION ---
# Using Nova-Lite for both to ensure UPI/Marketplace compatibility

INTENT_MODEL = "us.amazon.nova-lite-v1:0"
LIGHT_MODEL = "us.amazon.nova-lite-v1:0"
DYNAMODB_TABLE_NAME = "TraceAbilityLogs"

# Clients initialized globally for Lambda warm-starts
bedrock_client = boto3.client(
    "bedrock-runtime", 
    region_name="us-east-1",
    config=Config(retries={"max_attempts": 2})
) 
dynamodb = boto3.resource("dynamodb", region_name="ap-south-1")
table = dynamodb.Table(DYNAMODB_TABLE_NAME)

# --- SYSTEM PROMPTS ---

INTENT_SYSTEM_PROMPT = """
You are TraceAbility Labs Cognitive Engineering AI.
Analyze Git changes from a software architecture intelligence perspective.
Output STRICT JSON ONLY.
Fields: summary, intent_analysis, category (Bugfix|Feature|Refactor|Security|Performance), risk_score (0-100), confidence_score (0-100), spec_alignment_score (0-100).
"""

ARCH_SYSTEM_PROMPT = """
You are an AI software architecture analyst. 
Provide a short explanation (storytelling format) focusing on: Why this change was made, Business impact, and Maintainability.
"""

# --- NOVA INVOCATION LOGIC ---

def invoke_nova(model_id: str, system_prompt: str, user_prompt: str, max_tokens: int):
    """Universal wrapper for Amazon Nova Lite calls."""
    # Nova requires this specific message-v1 schema
    payload = {
        "schemaVersion": "messages-v1",
        "messages": [
            {
                "role": "user",
                "content": [{"text": f"Instructions: {system_prompt}\n\nInput: {user_prompt}"}]
            }
        ],
        "inferenceConfig": {
            "max_new_tokens": 400,  
            "temperature": 0.1,
            "topP": 0.9
        }
    }

    try:
        response = bedrock_client.invoke_model(
            modelId=model_id,
            body=json.dumps(payload),
            contentType="application/json",
            accept="application/json"
        )
        response_body = json.loads(response["body"].read())
        
        # Credit monitoring for hackathon budget tracking

        usage = response_body.get("usage", {})
        print(f"[CREDIT CHECK] In: {usage.get('inputTokens')} | Out: {usage.get('outputTokens')}")
        
        return response_body["output"]["message"]["content"][0]["text"]
    except Exception as e:
        print(f"Bedrock Error: {str(e)}")
        raise

# --- CORE PIPELINE FUNCTIONS ---

def invoke_intent_analysis(diff_content: str) -> dict:
    """Performs deep engineering reasoning on code changes."""
    MAX_DIFF_CHARS = 6000
    if len(diff_content) > MAX_DIFF_CHARS:
        diff_content = diff_content[:MAX_DIFF_CHARS] + "\n[... Diff truncated for cost ...]"

    try:
        output = invoke_nova(INTENT_MODEL, INTENT_SYSTEM_PROMPT, diff_content, 500)
        match = re.search(r'\{.*\}', output, re.DOTALL)
        if not match:
            raise ValueError("No JSON found in AI response")
        return json.loads(match.group(0))
    except Exception as error:
        raise RuntimeError(f"Intent analysis failed: {error}")

def generate_architecture_story(diff_content: str):
    """Generates the business impact narrative."""
    try:
        if not diff_content or len(diff_content.strip()) < 50:
            return "Minimal code change. No architectural impact detected."
        
        return invoke_nova(LIGHT_MODEL, ARCH_SYSTEM_PROMPT, diff_content, 200).strip()
    except Exception as error:
        print(f"Story Error: {error}")
        return "Architecture insight generation failed."


def calculate_trust_score(intent_data: dict) -> Decimal:
    """Calculates architectural trust and converts to Decimal for DynamoDB."""
    confidence = intent_data.get("confidence_score", 50)
    alignment = intent_data.get("spec_alignment_score", 50)
    
    # Calculate trust
    trust = ((confidence ** 0.5) * 0.5 + (alignment ** 0.5) * 0.5) * 100
    final_score = round(trust / 10, 2)
    
    # CRITICAL: Convert float to Decimal for DynamoDB
    return Decimal(str(final_score))

def store_intent(commit_id: str, intent_data: dict):
    """Persists enriched analysis to DynamoDB using Decimals for compatibility."""
    
    # Helper to safely convert to Decimal
    def to_dec(val):
        return Decimal(str(val)) if val is not None else Decimal('0')

    table.put_item(
        Item={
            "commit_id": commit_id,
            "summary": intent_data.get("summary"),
            "intent_analysis": intent_data.get("intent_analysis"),
            "category": intent_data.get("category"),
            "risk_score": to_dec(intent_data.get("risk_score")),
            "confidence_score": to_dec(intent_data.get("confidence_score")),
            "spec_alignment_score": to_dec(intent_data.get("spec_alignment_score")),
            "trust_score": to_dec(intent_data.get("final_trust_score")),
            "logged_at": datetime.now(timezone.utc).isoformat(),
            "expire_at": int(time.time()) + (30 * 24 * 3600)
        }
    )


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        import decimal
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def post_github_comment(commit_id, analysis, story):
    token = os.getenv("GITHUB_TOKEN")
    repo = os.getenv("GITHUB_REPO")
    
    if not token or not repo:
        print("GitHub configuration missing. Skipping comment.")
        return

    url = f"https://api.github.com/repos/{repo}/commits/{commit_id}/comments"
    
    # Create a beautiful Markdown comment
    comment_body = (
        f"### 🚀 Trace-Ability AI Analysis\n\n"
        f"**Summary:** {analysis.get('summary')}\n"
        f"**Category:** `{analysis.get('category')}` | **Trust Score:** {analysis.get('final_trust_score')}%\n\n"
        f"#### 🛡️ Architecture Narrative\n{story}\n\n"
        f"---\n*Generated by Trace-Ability Cognitive Engineering Engine*"
    )

    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }

    try:
        response = requests.post(url, json={"body": comment_body}, headers=headers)
        if response.status_code == 201:
            print(f"Successfully posted comment to commit {commit_id}")
        else:
            print(f"GitHub API Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Failed to post to GitHub: {str(e)}")


# --- MULTI-PURPOSE LAMBDA HANDLER ---
def lambda_handler(event, context):
    # 1. Handle CORS Pre-flight (Browser Security)
    
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        }

    try:
        # 2. HANDLE GET REQUEST (From React Dashboard)
        
        method = event.get("requestContext", {}).get("http", {}).get("method", "POST")
        
        if method == "GET":
            response = table.scan(Limit=15)
            items = response.get('Items', [])
            # Sort by date (newest first)
            items.sort(key=lambda x: x.get('logged_at', ''), reverse=True)
            
            return {
                "statusCode": 200,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps(items, cls=DecimalEncoder)
            }

        # 3. HANDLE POST REQUEST (From your Git Hook script)
        body = event if "commit_id" in event else json.loads(event.get("body", "{}"))
        commit_id = body.get("commit_id")
        diff_content = body.get("diff")

        if not commit_id or not diff_content:
            return {
                "statusCode": 400, 
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Missing commit_id or diff"})
            }

        # Execute AI Reasoning
        intent_result = invoke_intent_analysis(diff_content)
        
        # Enrich & Calculate Trust
        intent_result.setdefault("confidence_score", 50)
        intent_result.setdefault("spec_alignment_score", 50)
        intent_result["final_trust_score"] = float(calculate_trust_score(intent_result))

        # Storage
        store_intent(commit_id, intent_result)
        
        if "local-" not in str(commit_id):
            post_github_comment(commit_id, intent_result, arch_story)

        # Generate Story
        arch_story = generate_architecture_story(diff_content) if len(diff_content) < 6000 else "Story skipped (diff too large)"

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"}, # Enable React access
            "body": json.dumps({
                "status": "success",
                "analysis": intent_result,
                "architecture_story": arch_story
            }, cls=DecimalEncoder)
        }

    except Exception as error:
        print(f"[TraceAbility Pipeline Error] {error}")
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "AI Reasoning Pipeline Failed", "message": str(error)})
        }