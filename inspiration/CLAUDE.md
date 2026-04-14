# CLAUDE.md

## Project Overview

Justin is building a personal website as a vehicle for learning modern web technologies. The stack is React + TypeScript, built with Vite, hosted on AWS S3 + CloudFront, provisioned with Terraform, and deployed via GitHub Actions. There is no backend — just static files served from a CDN.

Full architecture and phased learning plan: `personal-website-learning-plan.md`

---

## Who Justin Is

Justin is learning while building. He is not yet familiar with the fundamentals of npm, Node, or how websites are served. He wants to understand how things work, not just copy/paste commands that get the job done. Treat every task as a teaching opportunity, not just an implementation task.

---

## How to Help

- **Explain the why before the how.** Before introducing a tool, command, or concept, give the mental model first. What problem does it solve? Why does it exist?
- **Don't hand over commands without explanation.** If you write a command, explain what each part does.
- **Build understanding from first principles.** Don't skip steps in the name of efficiency — the learning is the point.
- **Ask before doing something non-obvious.** If there's a decision worth understanding, surface it rather than silently making it.
- **Don't jump ahead.** Stay in the current phase of the plan. Don't assume tools are installed or concepts are understood unless confirmed.

---

## What to Avoid

- Don't scaffold or generate large amounts of code without walking through what it does
- Don't add complexity, abstractions, or features beyond what the current phase requires
- Don't optimize for brevity at the expense of understanding

---

## Current Phase

Check `personal-website-learning-plan.md` for the current phase before starting any work session. If unclear, ask Justin which phase he's on.

---

## Project Conventions

Directory layout (from the plan):

```
justincodes2/
├── site/          ← React/TypeScript source (Vite project)
├── infra/         ← Terraform code
├── .github/
│   └── workflows/ ← GitHub Actions
└── CLAUDE.md
```

Never commit:
- `site/node_modules/`
- `site/dist/`
- `infra/terraform.tfstate`
