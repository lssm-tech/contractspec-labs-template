---
root: true
targets: ['*']
description: 'ContractSpec codebase overview and rule index'
globs: ['**/*']
---

# ContractSpec Codebase

**Mission**: ContractSpec is the deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable.

## Quick Reference

| Concern             | Rule File                     | Key Points                          |
| ------------------- | ----------------------------- | ----------------------------------- |
| **Contracts**       | `contracts-first.md`          | Spec before implementation          |
| Mission & Context   | `contractspec-mission.md`     | Why we exist, who we serve          |
| Architecture        | `package-architecture.md`     | libs → bundles → apps               |
| Code Quality        | `code-quality-practices.md`   | Testing, naming, standards          |
| File Organization   | `code-splitting.md`           | Max 250 lines, domain grouping      |
| Type Safety         | `type-safety-dependencies.md` | No `any`, latest deps               |
| Frontend            | `frontend.md`                 | Atomic design, state handling       |
| Backend             | `backend.md`                  | Hexagonal, DDD                      |
| Design System       | `design-system-usage.md`      | No raw HTML                         |
| AI Governance       | `ai-agent.md`                 | Traceability, composability         |
| **Mode Governance** | `mode-governance.md`          | Guided / Pro / Autopilot boundaries |
| Documentation       | `docs.md`                     | DocBlocks first                     |

## Core Principles

1. **Spec-First**: Contracts define behavior before implementation
2. **Multi-Surface Consistency**: One spec → API, DB, UI, events
3. **Safe Regeneration**: Code can be regenerated without breaking invariants
4. **Standard Tech**: TypeScript, Zod, no magic abstractions
5. **Incremental Adoption**: Stabilize one module at a time

## Code Style (Enforced)

- **Language**: TypeScript (strict mode)
- **Formatting**: 2 spaces, semicolons, double quotes, trailing commas
- **Types**: Explicit, no `any`, proper type guards
- **Files**: Max 250 lines (components: 150, utilities: 100)

## Before You Code

1. Read relevant rules for your change type
2. Check existing patterns in the codebase
3. Plan with DocBlocks if adding new features
4. Run `/ai-audit` to verify decisions

## AI Agent Guidelines

When working with AI assistants:

- Rules are applied contextually based on file type
- Conflicts resolved by: Security > Compliance > Safety > Quality > UX > Performance
- All decisions should be traceable and reversible
- Use `/ai-audit` to verify governance compliance

## Commands Available

- `/commit` - Create conventional commit
- `/test` - Run tests with analysis
- `/lint` - Check and fix lint issues
- `/fix` - Auto-fix common issues
- `/build` - Build the project with error analysis and suggestions
- `/explain` - Understand code
- `/debug` - Guided issue investigation and debugging support
- `/contracts` - List and inspect contracts, optionally by domain
- `/analyze-codebase` - Analyze contract coverage, drift, and orphaned specs
- `/impact` - Generate SpecDelta impact analysis between branches
- `/evolve` - Generate spec-improvement suggestions from telemetry
- `/implementation-plan` - Execute a structured implementation plan
- `/plan-adapt` - Adapt an implementation plan to ContractSpec requirements
- `/apply-patch` - Apply a ContractSpec action item by ID with draft PR support
- `/refactor` - Guided refactoring
- `/review-pr` - Code review
- `/draft-pr` - Open a draft PR with generated title and description
- `/open-issue` - Create a GitHub issue with formatted context
- `/ai-audit` - Governance check
- `/mode-check` - Mode governance compliance audit
- `/audit-health` - File organization, reusability, and code health audit
- `/audit-i18n` - i18n compliance and hardcoded-string audit
- `/audit-observability` - Logging, analytics, and observability gap scan
- `/audit-session` - Session retrospective for agentpacks governance gaps
- `/review-plan` - Multi-perspective plan review before building

## Getting Help

- Check the specific rule file for detailed guidance
- Use `/explain <concept>` for architecture questions
- Run `/ai-audit` to verify your approach
