# Personal Website Learning Plan

## The Big Picture

Your website will follow this path:

```
You write code (React + TypeScript)
  → npm builds it into static files (HTML/CSS/JS)
    → AWS S3 hosts those files
      → AWS CloudFront serves them to visitors
        → Terraform provisions all the AWS infrastructure
          → GitHub stores your code and triggers deployments
```

No backend. No server to maintain. Just files on the internet.

---

## Phase 1: The Foundation — Node, npm, and the file system

**Goal:** Understand what npm actually is and why it exists before touching React.

### Why do you need Node and npm for a website?

This is a fair question — you're building something that runs in a browser, and browsers understand HTML, CSS, and JavaScript natively. So why does a server-side technology like Node.js have anything to do with it?

**The short answer:** Node never touches your live website. It only runs on your machine (and in CI/CD) as a build tool. It is never deployed to production and never serves pages to visitors.

**Node.js** is a JavaScript runtime — it lets JavaScript execute outside a browser, on your machine like any other program. The reason it matters here: every modern web build tool (Vite, the TypeScript compiler, React's toolchain) is written in JavaScript. To run those tools locally, your machine needs something that can execute JavaScript. That's Node. It's the same reason you need Python installed to run a Python script — you're not building a Python app, you just need the runtime to execute the tool.

**npm** (Node Package Manager) is the package manager that ships with Node. It solves a concrete problem: your project depends on hundreds of open-source libraries, each with its own version requirements. npm lets you declare what you need in `package.json`, then `npm install` downloads exactly those versions into `node_modules/`. Without npm, you'd manually download and wire up every library yourself. Think of it as pip for Python or Homebrew for macOS.

**How Homebrew fits in:**

Homebrew is a system-level package manager for macOS — it installs programs and runtimes onto your machine itself. npm and pip manage libraries *within* a language ecosystem; Homebrew manages the languages and tools that need to exist before any of that starts.

```
Homebrew          ← installs programs and runtimes onto macOS
  └── Node.js     ← installed via Homebrew
        └── npm   ← ships with Node, manages JavaScript packages
              └── node_modules/  ← where your project's packages live
```

Use Homebrew once to set up your machine, then mostly forget about it.

---

**If you know Python, npm will feel familiar:**

| Python | npm equivalent |
|---|---|
| `pip install` | `npm install` |
| `requirements.txt` | `package.json` |
| virtual environment folder | `node_modules/` |
| `pip install -r requirements.txt` | `npm install` (reads `package.json`) |

When you run `npm install` inside a project, packages download into that project's `node_modules/` folder — isolated to that project, not shared globally. Each project has its own copy. `package.json` is the manifest that tracks what the project needs, so anyone who clones the repo can run `npm install` and get everything.

The one exception: `npm install -g` installs a CLI tool globally (available system-wide), similar to Homebrew. Use this for developer tools, never for project dependencies.

---

**npm packages vs. node modules:**

These two terms are related but mean different things:
- **npm package** — a bundle of code published to the npm registry (the public internet library). It's what exists online, identified by a name like `vite` or `react`.
- **node module** — what that package becomes on your machine after it's downloaded. Everything inside `node_modules/` is a node module — the installed, local copy ready for your code to use.

The analogy: a package is like an app in the App Store. A node module is that app after you've installed it. One package can contain multiple modules internally, and modules depend on other modules — which is why `node_modules/` can have hundreds of folders even when you only installed a few packages.

---

**Why both are needed for a React + TypeScript site:**

| Problem | Tool | How it's delivered |
|---|---|---|
| Browsers don't understand TypeScript | TypeScript compiler (`tsc`) | npm package |
| Browsers don't understand JSX | Vite | npm package |
| Source code is split across many files | Vite bundles + minifies | npm package |
| You need a live-reload dev server | Vite dev server | npm package |

The chain looks like this:

```
You write TypeScript + JSX
  → Node runs Vite (an npm package)
    → Vite compiles everything into plain HTML/CSS/JS
      → Those output files go to S3
        → Visitors download them
```

Node and npm are only in the first step, on the build machine. They play no role in production.

---

**What you'll learn:**
- What Node.js is (a JavaScript runtime — not a web server here, just a build tool)
- What npm is (a package manager — like an app store for code libraries)
- What `package.json` is (the manifest that describes your project and its dependencies)
- What `node_modules/` is (where downloaded libraries live — you never commit this)
- What a "build" is: transforming your source code into files a browser can load

**Hands-on:**
1. Install Node.js (includes npm)
2. `npm init` a toy project from scratch, read every line of the generated `package.json`
3. Install one small package, understand what changed

---

## Phase 2: TypeScript — JavaScript with guardrails

**Goal:** Understand what TypeScript adds and why it matters before writing React.

**What you'll learn:**
- TypeScript is a superset of JavaScript — it adds types, then compiles down to plain JS
- Why types catch bugs before you run the code
- Basic types: `string`, `number`, `boolean`, arrays, objects, interfaces
- How the TypeScript compiler (`tsc`) works

**Hands-on:**
1. Write a small `.ts` file, run `tsc` to compile it, inspect the output `.js`
2. Intentionally introduce a type error and see the compiler catch it

---

### JSX and TSX

JSX is a syntax extension for JavaScript that lets you write HTML-like markup directly inside your JavaScript code:

```jsx
function Header() {
  return (
    <h1>Hi, I'm Justin</h1>
  );
}
```

That `<h1>` looks like HTML, but it's not — it's still a JavaScript file. JSX is **syntactic sugar**: a friendlier way to write `React.createElement()` calls, which is what the browser actually runs. Vite compiles JSX away before anything reaches the browser.

```
You write JSX (.tsx file)
  → Vite compiles it → plain JavaScript (React.createElement calls)
    → Browser runs that plain JavaScript
      → React builds the actual DOM elements the user sees
```

JSX is not something you install — it's just syntax. The translator is `@vitejs/plugin-react`, which Vite includes automatically when you scaffold the project.

**TSX** is the same thing but with TypeScript. Any file that contains markup uses the `.tsx` extension; pure logic files without markup use `.ts`.

One common gotcha: `class` is a reserved word in JavaScript, so in JSX you write `className` instead:

```jsx
// HTML:  <div class="header">
// JSX:   <div className="header">
```

---

## Phase 3: React + Vite — Building UI from components

**Goal:** Scaffold your real project with Vite, understand what it does, then start writing React.

### First: What is Vite?

Vite (pronounced "veet", French for "fast") is just an **npm package** — a build tool you install like anything else. It has two jobs:

**1. Development server (`npm run dev`)**
Runs a local web server on your machine at `http://localhost:5173`. It watches your files and instantly refreshes the browser the moment you save a change — this is called Hot Module Replacement (HMR). You see your changes in under a second.

**2. Production build (`npm run build`)**
Translates your TypeScript and JSX into plain HTML/CSS/JS that any browser can load, and writes the output into a `dist/` folder. This is what you upload to S3.

Browsers don't understand TypeScript or JSX natively — they only understand plain JavaScript. Vite bridges that gap. It also minifies the code (strips whitespace, shortens variable names) and bundles hundreds of small files into a few optimized ones for fast page loads.

**What Vite is NOT:**
- Not a web server you deploy to production — CloudFront handles that
- Not a framework — React is the framework, Vite is just the toolchain around it

Once installed, Vite shows up in your `package.json` scripts like this:
```json
"scripts": {
  "dev":     "vite",
  "build":   "vite build",
  "preview": "vite preview"
}
```
So `npm run dev` just runs Vite's dev server, and `npm run build` just runs Vite's compiler. Nothing magic.

> **The key insight:** `npm run dev` is for you (fast, readable, instant feedback). `npm run build` is for the internet (small, optimized, browser-compatible).

---

### npm packages you'll be working with

**Installed automatically by the Vite scaffold (`npm create vite@latest -- --template react-ts`):**

| Package | What it does |
|---|---|
| `react` | The React library itself |
| `react-dom` | Renders React components into the browser |
| `typescript` | The TypeScript compiler |
| `vite` | The build tool and dev server |
| `@vitejs/plugin-react` | Teaches Vite how to handle JSX |
| `@types/react` | TypeScript definitions for React |
| `@types/react-dom` | TypeScript definitions for react-dom |

**Added manually when you need them:**

| Package | What it does | When |
|---|---|---|
| `react-router-dom` | Handles navigation between pages | Phase 3/8, once you have multiple pages |
| `tailwindcss` | Utility-first CSS framework | Phase 3, after React is rendering |

---

### Tailwind CSS

Tailwind is the CSS framework we'll use for styling. Instead of writing separate `.css` files and inventing class names, you apply small utility classes directly in your JSX:

```jsx
// Instead of writing a .hero CSS class somewhere else:
<div className="flex flex-col items-center bg-gray-900 text-white p-8">
```

**Why Tailwind:**
- Designed for React's component model — styles live with the component
- No JavaScript, so no conflict with React's DOM control
- The dominant choice in the modern React ecosystem
- It's an npm package that plugs into the Vite build pipeline you're already using

**Later addition — shadcn/ui:** Once comfortable with Tailwind, shadcn/ui is worth adding. It provides pre-built React components (buttons, navbars, modals) that are built on Tailwind and delivered as code you own and can modify — not a locked-in library.

---

### What you'll learn about React

- What a component is (a function that returns HTML-like JSX)
- How React re-renders when data changes (the concept of state)
- What JSX is and how it compiles to `React.createElement()` calls

---

### Content Architecture — Separating content from code

One of the most important decisions before writing any components: **keep content out of components**. Components should be pure display logic — they read content and render it. You should never have to touch a component just to update your bio or add a project.

**The rule:** if it's words, data, or images that might change — it lives in `src/content/`, not inside a component.

**Two formats, used together:**

| Content type | Format | Why |
|---|---|---|
| Bio, About Me, long prose | Markdown (`.md` files) | Readable and editable like a document — no code knowledge needed |
| Projects list, interests gallery, contact links | TypeScript data files (`.ts`) | Structured data with a consistent shape — easy to add entries |

**Directory structure:**

```
site/src/
├── content/
│   ├── about.md          ← long-form prose, readable like a document
│   ├── projects.ts       ← structured list of projects
│   ├── interests.ts      ← structured interests/gallery data
│   └── contact.ts        ← links, email, social handles
├── components/           ← display logic only, no hardcoded text
├── pages/                ← routed pages, pull from content/
```

**Example — a TypeScript content file:**

```ts
// src/content/projects.ts

export const projects = [
  {
    title: "Stock Analyzer",
    description: "A tool for analyzing financial data...",
    tags: ["Python", "React"],
    link: "https://github.com/..."
  },
]
// To add a new project: add a new object to this array. Nothing else changes.
```

**Rendering Markdown in React** requires one small npm package — `react-markdown` — which reads a `.md` file and converts it to HTML elements that React can render. You install it once and forget about it.

This approach means:
- Updating your bio = editing `about.md`, no React knowledge needed
- Adding a project = adding one object to `projects.ts`
- Nothing in `components/` ever needs to change for content updates

---

### Hands-on

**Step 1 — Scaffold the project with Vite:**
```bash
npm create vite@latest site -- --template react-ts
cd site
npm install
```
This downloads Vite and React, wires up TypeScript, and creates your project structure. One command.

**Step 2 — Read before you run:**
- Open `package.json` — find Vite listed as a dependency, read the scripts section
- Open `vite.config.ts` — understand each line
- Open `tsconfig.json` — see how TypeScript is configured

**Step 3 — Run the dev server:**
```bash
npm run dev
```
Open `http://localhost:5173`. Edit a component and watch the browser update instantly.

**Step 4 — Build for production:**
```bash
npm run build
```
Open the `dist/` folder. Notice your `.tsx` files are gone — compiled into plain `.js`. Open one of those `.js` files and see how minified it looks versus what you wrote.

**Step 5 — Preview the build locally:**
```bash
npm run preview
```
This serves `dist/` exactly as S3 + CloudFront will. Use this to verify your build before deploying.

**Step 6 — Build your components:**
- A header with your name
- A bio / about section
- A projects or links section

---

## Phase 4: GitHub — Version control and collaboration

**Goal:** Track your code, understand branching, and set up a deployment trigger.

**What you'll learn:**
- What git is vs. what GitHub is (git = the tool, GitHub = the hosting service)
- Commits, branches, pull requests
- GitHub Actions: running automated tasks (like deploying) when you push code
- Secrets in GitHub Actions (how to pass AWS credentials safely)

**Hands-on:**
1. Push your React project to a new GitHub repo
2. Write a simple GitHub Actions workflow that runs `npm run build` on every push to `main`

---

## Phase 5: AWS — Hosting the files

**Goal:** Understand what S3 and CloudFront actually do before letting Terraform touch them.

**What you'll learn:**
- **S3**: Object storage. You upload files, they get a URL. Think of it as a hard drive on the internet.
- **CloudFront**: A CDN (Content Delivery Network). It caches your files at edge locations around the world so they load fast everywhere. It also handles HTTPS.
- **Route 53**: AWS's DNS service. Maps your domain name to CloudFront.
- **IAM**: Identity and Access Management. Controls who/what can do what in your AWS account.

**Hands-on (manually first):**
1. Create an S3 bucket by hand in the AWS console, upload your built files, make them public
2. Put CloudFront in front of it by hand
3. Visit your site via the CloudFront URL

> Doing it manually first makes the Terraform code meaningful instead of magic.

---

## Phase 6: Terraform — Infrastructure as code

**Goal:** Codify everything you did manually in Phase 5 so it's repeatable and version-controlled.

**What you'll learn:**
- What "infrastructure as code" means
- Terraform's core concepts: providers, resources, state file
- How Terraform's plan/apply cycle works (it shows you what it will do before it does it)
- How to destroy and recreate infrastructure reliably

**What you'll build:**
```hcl
# The resources Terraform will manage:
- aws_s3_bucket (your file storage)
- aws_cloudfront_distribution (your CDN)
- aws_route53_record (your domain name)
- aws_acm_certificate (your HTTPS certificate)
- aws_iam_policy (deployment permissions)
```

**Hands-on:**
1. Destroy what you created manually
2. Re-create the exact same infrastructure with Terraform
3. Run `terraform plan` before every change so you read what will happen

---

## Phase 7: CI/CD — Connecting the pieces

**Goal:** Push code to GitHub → site updates automatically.

**What you'll build:**

A GitHub Actions workflow that:
1. Runs on push to `main`
2. Installs dependencies (`npm install`)
3. Builds the site (`npm run build`)
4. Syncs the `dist/` folder to S3 (`aws s3 sync`)
5. Invalidates the CloudFront cache so visitors see the new version immediately

---

## Phase 8: The website itself

With the pipeline working, you can focus on the actual content. Suggested sections:
- Home / hero
- About / bio
- Projects or portfolio
- Contact / links

You'll build this with React components and TypeScript the whole way through.

---

## Client-Side Rendering vs. Server-Side Rendering

**How your site works (client-side rendering):**

When a visitor loads your site, the browser receives a nearly empty HTML file — just a `<div id="root"></div>`. It then downloads your JavaScript bundle, runs it, and React builds the page. The browser (the "client") does all the rendering work.

**The tradeoff:** The user sees a blank screen until JavaScript loads and runs. Search engine crawlers may also see an empty page before React fills it in.

**Server-side rendering (SSR)** flips this: the server runs React itself, builds the full HTML, and sends a complete page to the browser. The user sees content immediately. After the page loads, JavaScript kicks in and React "takes over" the already-rendered HTML — this is called **hydration**.

```
Client-side:  Browser gets empty HTML → downloads JS → React builds page → user sees content
Server-side:  Browser gets complete HTML → user sees content → JS loads → React takes over
```

**Why you don't need SSR yet:** Your site is static — the content is the same for every visitor. Vite handles this well without a server. SSR becomes valuable when pages need to be generated dynamically per request (e.g., a logged-in user sees their own data). **Next.js** is the natural next step after this project — it's React plus SSR, routing, and more.

---

## What about nginx?

For a **static site**, you don't need nginx at all — CloudFront replaces it. If you later want to understand nginx, it's a web server you'd run on a Linux machine to serve files or proxy requests. It's worth learning eventually, but it would just add complexity here for no benefit.

---

## Suggested order to start

1. Install Node + verify npm works
2. Read about what npm does (the official docs intro is excellent)
3. Scaffold a React + TypeScript project with Vite (faster and simpler than create-react-app)
4. Get something rendering in the browser locally

When you're ready to start any phase, just ask and we'll dig in together — reading config files, explaining output, building understanding from first principles.

---

## Project Directory Structure

### Everything lives in one GitHub repository

```
justincodes2/                          ← your GitHub repo root
│
├── site/                              ← all React/TypeScript source code
│   ├── src/
│   │   ├── components/                ← reusable UI pieces (Button, Header, etc.)
│   │   ├── pages/                     ← top-level page components (Home, About, etc.)
│   │   ├── assets/                    ← images, fonts, icons
│   │   ├── styles/                    ← CSS or styling files
│   │   └── main.tsx                   ← entry point, mounts the React app
│   ├── public/                        ← static files copied as-is (favicon, robots.txt)
│   ├── dist/                          ← BUILD OUTPUT — never commit this
│   ├── node_modules/                  ← npm packages — never commit this
│   ├── index.html                     ← the HTML shell Vite uses
│   ├── package.json                   ← project manifest and npm scripts
│   ├── tsconfig.json                  ← TypeScript compiler configuration
│   └── vite.config.ts                 ← Vite build tool configuration
│
├── infra/                             ← all Terraform code
│   ├── main.tf                        ← root module, ties everything together
│   ├── variables.tf                   ← input variables (domain name, region, etc.)
│   ├── outputs.tf                     ← values Terraform prints after apply (URLs, etc.)
│   └── providers.tf                   ← declares AWS as the provider
│
├── .github/
│   └── workflows/
│       └── deploy.yml                 ← GitHub Actions: build + deploy on push to main
│
├── .gitignore                         ← tells git what NOT to track
└── personal-website-learning-plan.md
```

### What gets committed to GitHub

| Path | Committed? | Why |
|---|---|---|
| `site/src/` | Yes | Your source code |
| `site/dist/` | No | Build output — regenerated by CI/CD |
| `site/node_modules/` | No | Reinstalled from `package.json` |
| `infra/*.tf` | Yes | Your infrastructure code |
| `infra/terraform.tfstate` | No | Stored in S3 instead (see below) |
| `.github/workflows/` | Yes | Your deployment automation |

### A note on Terraform state

Terraform keeps a file called `terraform.tfstate` that tracks every AWS resource it has created. By default this is a local file, but that creates a problem — if it only lives on your laptop, GitHub Actions can't use it during deployments. The standard solution is **remote state**: storing the state file in an S3 bucket so any process can access it. We'll configure this in Phase 6.
