# Resources for AI Development

Tools and documentation that may help accelerate development.

---

## Free Software from Rhea Impact

AIC contributes to [Rhea Impact](https://github.com/rhea-impact), a nonprofit offering free software for AI coding agents.

| Tool | Description | Link |
|------|-------------|------|
| **taskr** | AI-native task management for Claude Code and MCP-compatible agents. Automates project planning with GitHub integration. | [github.com/rhea-impact/taskr](https://github.com/rhea-impact/taskr) |
| **applaud** | Chat-native Claude Code client with hot-swappable themes | [github.com/rhea-impact/applaud](https://github.com/rhea-impact/applaud) |
| **space-hog** | Find and reclaim wasted disk space on macOS | [github.com/rhea-impact/space-hog](https://github.com/rhea-impact/space-hog) |

Browse all: https://github.com/rhea-impact

---

## AI Agent Documentation

**Rhea Impact Docs** - Documentation specifically designed to help AI agents build better things.

https://rhea-impact.github.io

These docs are structured for LLM consumption, making it easier for Claude Code and similar agents to understand patterns and implement features correctly.

---

## Context7 MCP (Documentation Lookup)

[Context7](https://github.com/upstash/context7) is an MCP server that pulls up-to-date, version-specific documentation directly into your AI prompts.

**Why it's useful:**
- Fetches current official documentation from library sources
- Gets docs for the exact version you're using
- No more outdated API references or hallucinated methods
- Free and open source (by Upstash)

**Installation:**
```bash
# For Claude Code
claude mcp add context7 -- npx -y @upstash/context7-mcp

# Get a free API key for higher rate limits
# https://context7.com/dashboard
```

**Usage:**
Add "use context7" to your prompt:
> "Create a Next.js middleware that... use context7"

Or specify a library directly if you know what you need.

---

*Last Updated: January 27, 2026*
