# CLAUDE.md — YT-Suite

## Project Overview

**YT-Suite** is a suite of useful tools for YouTube videos. The project is in early initialization; only the README exists at this stage.

## Repository State (as of 2026-03-14)

```
YT-Suite/
├── README.md       # Project description
└── CLAUDE.md       # This file
```

No source code, dependencies, configuration files, CI/CD pipelines, or tests have been added yet.

## Git Conventions

- **Default branch**: `master` (local) / `main` (remote origin)
- **Feature branches**: Use descriptive prefixes, e.g. `feature/`, `fix/`, `claude/`
- **Commit messages**: Use imperative mood, short summary line (≤72 chars), e.g. `Add YouTube transcript downloader`
- **Remote**: `http://local_proxy@127.0.0.1:44421/git/NinjaKristo/YT-Suite`

## Development Guidelines for AI Assistants

### Before Writing Code

1. Clarify which YouTube tool/feature is being built (downloader, transcript extractor, metadata fetcher, etc.)
2. Confirm the target language/runtime — this project has no language yet; ask before assuming
3. Check if a `package.json`, `pyproject.toml`, or `requirements.txt` should be initialized first

### Code Style (to be established)

Since no language has been chosen, adopt these defaults when code is first introduced:

- **Python**: Follow PEP 8; use `ruff` for linting; `black` for formatting; type hints required
- **JavaScript/TypeScript**: Use ESLint + Prettier; prefer TypeScript; ES modules (`import`/`export`)
- **File naming**: `snake_case` for Python, `camelCase` or `kebab-case` for JS/TS files

### Project Structure (recommended once code is added)

```
YT-Suite/
├── src/                  # Source code
│   └── <tool-name>/      # One directory per tool
├── tests/                # Tests mirror src/ structure
├── docs/                 # Additional documentation
├── .env.example          # Environment variable template (never commit .env)
├── README.md
└── CLAUDE.md
```

### Environment Variables

- Copy `.env.example` to `.env` for local development; never commit `.env`
- YouTube Data API keys, OAuth tokens, and cookies must be stored in `.env`

### Testing

- Write tests for all non-trivial functions
- Tests live in `tests/` and mirror the structure of `src/`
- Run tests before committing

### Dependencies

- Pin all dependency versions to avoid unexpected breakage
- Document the purpose of each major dependency in comments or README

## Updating This File

Keep this file current. When new tooling, frameworks, conventions, or architectural decisions are made, update the relevant section of this document before or alongside the implementation PR.
