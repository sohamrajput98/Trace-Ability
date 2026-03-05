import json
import boto3
import os
import re
import time
from datetime import datetime, timezone
from botocore.exceptions import ClientError

# MODEL ROUTING CONFIG

INTENT_MODEL = "apac.anthropic.claude-3-5-sonnet-20241022-v2:0"
LIGHT_MODEL = "amazon.nova-lite-v1:0"

DYNAMODB_TABLE_NAME = "TraceAbilityLogs"


bedrock_client = boto3.client("bedrock-runtime", region_name=os.getenv("BEDROCK_REGION", "us-east-1")) 
dynamodb = boto3.resource("dynamodb", region_name="ap-south-1")
table = dynamodb.Table(DYNAMODB_TABLE_NAME)


# PROMPT CACHEABLE SYSTEM PROMPTS

INTENT_SYSTEM_PROMPT = """
You are TraceAbility Labs Cognitive Engineering AI.

Analyze Git changes from a software architecture intelligence perspective.

Output STRICT JSON ONLY.

Analyze and return:

summary -> short change explanation
intent_analysis -> why developer made this change
category -> Bugfix | Feature | Refactor | Security | Performance
risk_score -> 0 to 100
confidence_score -> 0 to 100
spec_alignment_score -> 0 to 100
"""

ARCH_SYSTEM_PROMPT = """
You are an AI software architecture analyst.

Provide a short explanation focusing on:
1. Why this change was made
2. Business impact
3. Maintainability impact

Output in short storytelling format.
"""



# BEDROCK INVOCATION LAYER


def invoke_model(model_id: str, system_prompt: str, user_prompt: str, max_tokens: int):
    
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",

        "system": [
            {
                "type": "text",
                "text": system_prompt
            },
            {
               
                "type": "cache_control",
                "cachePoint": {"type": "default"}
            }
        ],
         "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": user_prompt
                    }
                ]
            }
        ],
        "max_tokens": max_tokens,
        "temperature": 0
    }

    try:
        response = bedrock_client.invoke_model(
            modelId=model_id,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="application/json"
        )

        response_body = json.loads(response["body"].read())

      
        usage = response_body.get("usage", {})
        
        
        read_cache = usage.get("cacheReadInputTokenCount", 0)
        write_cache = usage.get("cacheWriteInputTokenCount", 0)
        input_t = usage.get("inputTokens", 0)
        output_t = usage.get("outputTokens", 0)

        print(f"[CREDIT CHECK] Model: {model_id}")
        print(f"-> Cache Hit (90% off): {read_cache} tokens")
        print(f"-> New Tokens: {input_t} | Output: {output_t}")

        return response_body["content"][0]["text"]

    except Exception as e:
        print(f"AWS Bedrock Error: {e}")
        raise


# INTENT ANALYSIS 

def invoke_intent_analysis(diff_content: str) -> dict:
   
    MAX_DIFF_CHARS = 6000
    if len(diff_content) > MAX_DIFF_CHARS:
        
        diff_content = diff_content[:MAX_DIFF_CHARS] + "\n[... Diff truncated for cost optimization ...]"

    
    user_prompt = f"""
Git Diff:
{diff_content}

Provide deep engineering reasoning, not just summary.
"""

    try:
        
        output = invoke_model(
            INTENT_MODEL,
            INTENT_SYSTEM_PROMPT,
            user_prompt,
            max_tokens=450
        )

        
        match = re.search(r'\{.*\}', output, re.DOTALL)
        if not match:
             
            print(f"AI Response was not JSON: {output}")
            raise ValueError("No JSON found in AI response")

        return json.loads(match.group(0))

    except Exception as error:
        raise RuntimeError(f"Bedrock intent analysis failed: {error}")


# ARCHITECTURE STORY 

def generate_architecture_story(diff_content: str):

    try:

        if not diff_content or len(diff_content.strip()) < 50:
            return "Minimal code change. No architectural impact detected."

        if len(diff_content) > 8000:
            return "Large diff detected. Architecture story generation skipped to optimize cost."

        output = invoke_model(
            LIGHT_MODEL,
            ARCH_SYSTEM_PROMPT,
            diff_content,
            max_tokens=120
        )

        return output.strip()

    except Exception as error:
        print(f"[TraceAbility Story Engine Error] {error}")
        return "Architecture insight generation failed."


# TRUST SCORE

def calculate_trust_score(intent_data: dict) -> float:

    confidence = intent_data.get("confidence_score", 50)
    alignment = intent_data.get("spec_alignment_score", 50)

    trust = (
        (confidence ** 0.5) * 0.5 +
        (alignment ** 0.5) * 0.5
    ) * 100

    return round(trust / 10, 2)


# STORAGE

def store_intent(commit_id: str, intent_data: dict):

    table.put_item(
        Item={
            "commit_id": commit_id,
            "summary": intent_data.get("summary"),
            "intent_analysis": intent_data.get("intent_analysis"),
            "category": intent_data.get("category"),
            "risk_score": intent_data.get("risk_score"),
            "confidence_score": intent_data.get("confidence_score"),
            "spec_alignment_score": intent_data.get("spec_alignment_score"),
            "trust_score": intent_data.get("final_trust_score"),
            "logged_at": datetime.now(timezone.utc).isoformat(),
            "expire_at": int(time.time()) + (30 * 24 * 3600)
        }
    )


# LAMBDA ENTRYPOINT

def lambda_handler(event, context):

    try:

        body = json.loads(event["body"]) if "body" in event else event

        commit_id = body["commit_id"]
        diff_content = body["diff"]

        if not isinstance(diff_content, str) or not diff_content.strip():
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Empty or invalid diff content"})
            }

        # INTENT ANALYSIS

        intent_result = invoke_intent_analysis(diff_content)

        if not isinstance(intent_result, dict):
            raise ValueError("Invalid AI response format")

        required_keys = ["summary", "intent_analysis", "category"]

        for key in required_keys:
            if key not in intent_result or not intent_result[key]:
                raise ValueError(f"Missing AI field: {key}")

        intent_result.setdefault("confidence_score", 50)
        intent_result.setdefault("spec_alignment_score", 50)
        intent_result.setdefault("risk_score", 50)

        intent_result["final_trust_score"] = calculate_trust_score(intent_result)

        store_intent(commit_id, intent_result)

        return {
            "statusCode": 200,
            "body": json.dumps({
                "status": "success",
                "analysis": intent_result,
                "architecture_story":
                    generate_architecture_story(diff_content)
                    if len(diff_content) < 6000
                    else "Story skipped for cost optimization"
            })
        }

    except Exception as error:

        print(f"[TraceAbility Pipeline Error] {error}")

        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": "AI reasoning pipeline failed",
                "message": str(error)
            })
        }