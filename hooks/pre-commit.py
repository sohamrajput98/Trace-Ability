#!/usr/bin/env python3

import subprocess
import requests
import sys
import json
from datetime import datetime

# ⭐ Replace this with your real Lambda URL
LAMBDA_URL = "https://wqn6vtpx2yrpfqb3qligyyt4ru0vjicb.lambda-url.ap-south-1.on.aws/"


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

    except:
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
            timeout=8
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

    commit_id = get_commit_id()

    send_to_lambda(commit_id, staged_diff)


if __name__ == "__main__":
    main()