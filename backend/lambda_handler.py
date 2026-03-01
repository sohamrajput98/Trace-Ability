import json
import boto3
import os
import re
from datetime import datetime, timezone
from botocore.exceptions import ClientError

BEDROCK_MODEL_ID = "apac.anthropic.claude-3-5-sonnet-20241022-v2:0"
DYNAMODB_TABLE_NAME = "TraceAbilityLogs"

bedrock_client = boto3.client("bedrock-runtime")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(DYNAMODB_TABLE_NAME)


def invoke_bedrock(diff_content: str) -> dict:

    system_prompt = """
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

    user_prompt = f"""
    Git Diff:
    {diff_content}

    Provide deep engineering reasoning, not just summary.
    """

    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "max_tokens": 700,
        "temperature": 0.2
    }


    try:
        response = bedrock_client.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="application/json"
        )

        response_body = json.loads(response["body"].read())

        model_output = response_body["content"][0]["text"]

        cleaned_output = re.sub(r"```json|```", "", model_output).strip()

        return json.loads(cleaned_output)

    except Exception as error:
        raise RuntimeError(f"Bedrock invocation failed: {error}")

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
            "trust_score": intent_data.get("trust_score"),
            "logged_at": datetime.now(timezone.utc).isoformat()
        }
    )

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

        # AI Reasoning Pipeline
        intent_result = invoke_bedrock(diff_content)

        if not isinstance(intent_result, dict):
            raise ValueError("Invalid AI response format")

        required_keys = ["summary", "intent_analysis", "category"]

        for key in required_keys:
            if key not in intent_result or not intent_result[key]:
                raise ValueError(f"Missing AI field: {key}")

        # Safe metric defaults
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
                "architecture_story": generate_architecture_story(diff_content)
                if len(diff_content) < 3000
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
    
def calculate_trust_score(intent_data: dict) -> float:

    confidence = intent_data.get("confidence_score", 50)
    alignment = intent_data.get("spec_alignment_score", 50)

    trust = (
        (confidence ** 0.5) * 0.5 +
        (alignment ** 0.5) * 0.5
    ) * 100

    return round(trust / 10, 2)

def generate_architecture_story(diff_content: str):

    try:
       
        if not diff_content or len(diff_content.strip()) < 50:
            return "Minimal code change. No architectural impact detected."

        if len(diff_content) > 8000:
            return "Large diff detected. Architecture story generation skipped to optimize cost."

        prompt = """
        You are an AI software architecture analyst.

        Provide a short explanation focusing on:
        1. Why this change was made
        2. Business impact
        3. Maintainability impact

        Output in short storytelling format.
        """

        request_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "messages": [
                {"role": "system", "content": prompt},
                {"role": "user", "content": diff_content}
            ],
            "max_tokens": 180,
            "temperature": 0.4
        }

        response = bedrock_client.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="application/json"
        )

        response_body = json.loads(response["body"].read())

        return response_body["content"][0]["text"]

    except Exception as error:
        print(f"[TraceAbility Story Engine Error] {error}")
        return "Architecture insight generation failed."

