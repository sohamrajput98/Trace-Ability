#!/usr/bin/env python3

import subprocess
import requests
import sys
import json
from datetime import datetime

LAMBDA_URL = "https://wqn6vtpx2yrpfqb3qligyyt4ru0vjicb.lambda-url.ap-south-1.on.aws/"

MAX_DIFF_CHARS = 6000


def get_staged_diff() -> str:
    try:
        result = subprocess.run(
            ["git", "diff", "--cached"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True,
        )
        return result.stdout.strip()

    except subprocess.CalledProcessError as error:
        print(f"[TraceAbility] Diff fetch failed: {error.stderr}")
        sys.exit(1)


def clean_diff(diff: str) -> str:
    
    cleaned_lines = []

    for line in diff.split("\n"):
        if line.startswith("index "):
            continue
        if line.startswith("--- "):
            continue
        if line.startswith("+++ "):
            continue
        cleaned_lines.append(line)

    return "\n".join(cleaned_lines)


def get_commit_id() -> str:
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True,
        )
        return result.stdout.strip()

    except Exception:
        return f"local-{int(datetime.utcnow().timestamp())}"


def send_to_lambda(commit_id: str, diff_content: str) -> None:

    payload = {
        "commit_id": commit_id,
        "diff": diff_content,
        "timestamp": datetime.utcnow().isoformat()
    }

    try:
        response = requests.post(
            LAMBDA_URL,
            json=payload,
            timeout=15
        )

        response.raise_for_status()

        print("[TraceAbility] AI reasoning recorded successfully")

    except Exception as error:
        print(f"[TraceAbility Warning] AI pipeline failed but commit will continue: {error}")


def main():

    staged_diff = get_staged_diff()

    if not staged_diff:
        print("[TraceAbility] No staged changes detected.")
        sys.exit(0)

    if "Binary files" in staged_diff:
        print("[TraceAbility] Binary change detected. Skipping AI analysis.")
        sys.exit(0)

    staged_diff = clean_diff(staged_diff)


    if len(staged_diff) > MAX_DIFF_CHARS:
        print("[TraceAbility] Large diff detected, truncating for AI analysis.")
        staged_diff = staged_diff[:MAX_DIFF_CHARS]

    commit_id = get_commit_id()

    send_to_lambda(commit_id, staged_diff)


if __name__ == "__main__":
    main()