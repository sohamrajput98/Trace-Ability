# Trace-Ability

AI-powered developer productivity tool that captures the "why" behind your code.

## Quick Start

```bash
# Install CLI
pip install trace-ability

# Initialize in your repository
cd your-project
trace-ability init

# Query the logic map
trace-ability why src/auth/login.ts:45
```

## Features

- 🔍 Searchable Logic Map - Find out why any code exists
- 🤖 AI-Powered Analysis - LLM analyzes commits and maps to goals
- 🏷️ Source-of-Truth Tagging - Track human vs AI-generated code
- 📊 Web Dashboard - Visualize project evolution
- ⚡ Git Integration - Automatic analysis on every commit

## Documentation

See [DESIGN.md](./DESIGN.md) for complete technical design.

## Architecture

```
Git Hooks → Analysis Engine → Vector DB → CLI/Dashboard
```

## Development

```bash
# Setup
docker-compose up -d
pip install -e ".[dev]"

# Run tests
pytest

# Start dashboard
cd dashboard && npm run dev
```
## 💡 The Vision: Solving "Context Collapse"
In the 2026 development landscape, AI generates code faster than humans can document it. **Trace-Ability** acts as the "Flight Data Recorder" for your IDE. It ensures that the *reasoning* behind a change—the human intent—is never lost, even if the code was suggested by an AI.

## 🛠️ Built with Kiro
This project utilizes **Kiro's Spec-to-Design workflow** to ensure rigorous engineering standards:
- **EARS Notation:** All requirements are structured using the *Easy Approach to Requirements Syntax* for maximum clarity.
- **Spec-Driven Development:** Architecture was derived directly from high-level intent, ensuring the design covers all edge cases of Git-hook interception and asynchronous LLM analysis.

## 🚀 Future Roadmap
- **IDE Native Integration:** Extension for VS Code and JetBrains to show "Intent Annotations" in the gutter.
- **Team Knowledge Synthesis:** Weekly "Intent Digests" for Tech Leads to see how the project's logic is evolving.
- **Offline LLM Support:** Integration with local Llama 3/Mistral models for air-gapped security.

## 🎓 Student Track
**Track:** AI for Learning & Developer Productivity  
**Focus:** Reducing "Documentation Debt" and accelerating developer onboarding through semantic knowledge mapping.
