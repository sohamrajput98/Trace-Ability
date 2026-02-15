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
