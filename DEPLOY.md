# Deployment Plan — justin-codes.com

## What Are We Actually Doing?

Right now, your site only exists on your laptop. When you run `npm run dev`, Vite spins up a tiny local web server so you can see the site at `localhost:5173`. Nobody else can see it.

To make it available to the world at `justin-codes.com`, we need to:

1. Put the built files somewhere on the internet (S3)
2. Serve them fast and securely over HTTPS (CloudFront + ACM)
3. Make sure `justin-codes.com` points to the right place (Route 53)
4. Automate the whole process so pushing code deploys automatically (GitHub Actions)

---

## The Build Step — What Is `dist/`?

Reminder: Vite is a modern, high-performance frontend build tool for web development. It helps developers create and serve JavaScript/TypeScript-based web apps (especially those using frameworks like React, Vue, Svelte, or even vanilla JS) with a focus on speed and simplicity.

Your site is written in React + TypeScript. Browsers don't actually understand TypeScript or JSX — they only understand plain HTML, CSS, and JavaScript. So before deploying, Vite **compiles and bundles** everything into a `dist/` folder of plain browser-ready files.

```bash
cd site
npm run build
```

Open the `dist/` folder after running this and you'll see:
- `index.html` — the single HTML file for the whole app
- `assets/` — your JavaScript, CSS, and images all bundled and minified

These are the files that go on the internet. Nothing else. The React source code, TypeScript, node_modules — none of that ships.

---

## The Tools We're Using

| Tool | What it is | Analogy |
|------|------------|---------|
| **GitHub** | Hosts your source code and runs automated tasks | Google Drive for code, with superpowers |
| **GitHub Actions** | Automation that runs when you push code | A robot that does your deployment for you |
| **AWS S3** | File storage in the cloud | A hard drive on the internet |
| **AWS CloudFront** | Content Delivery Network (CDN) | Copies of your site cached at servers around the world |
| **AWS ACM** | SSL certificate provider | The thing that makes `https://` work (the padlock) |
| **AWS Route 53** | DNS — translates domain names to IP addresses | The phone book of the internet |
| **AWS IAM** | Controls who/what can access AWS resources | Permissions and keys |

---

## Phase 1 — Local Preparation

### 1.1 Install AWS CLI

The AWS CLI (Command Line Interface) lets you control AWS from your terminal instead of clicking around the web console. GitHub Actions will use the same commands to deploy your site automatically.

```bash
brew install awscli
aws --version
```

### 1.2 Verify the build works locally

Before deploying anything, make sure the build succeeds cleanly on your machine:

```bash
cd site
npm run build
```

You should see a `dist/` folder appear. If there are any TypeScript errors, they'll show up here. Fix them before moving on.

---

## Phase 2 — GitHub Setup

### Why GitHub?

Two reasons: (1) it's your backup — your code is safe even if your laptop dies, and (2) it's the trigger for your CI/CD pipeline. Every time you push to the `main` branch, GitHub Actions will automatically build and deploy your site.

### 2.1 Create the GitHub repo

- Go to github.com → New repository
- Name: `justincodes2`
- Visibility: Private for now
- **Do NOT** check "Initialize with README" — your project already has files and you don't want a conflict

### 2.2 Initialize git and push

Git is version control — it tracks every change you make to your code. Right now your project isn't a git repository yet. `git init` sets that up.

```bash
cd /Users/justinhanson/prepos/justincodes2
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/justincodes2.git
git branch -M main
git push -u origin main
```

**What each command does:**
- `git init` — turns the folder into a git repository
- `git add .` — stages all files for the commit (tells git "track these")
- `git commit -m "..."` — saves a snapshot of the code with a message
- `git remote add origin ...` — tells git where on GitHub to push to
- `git branch -M main` — names the branch `main`
- `git push -u origin main` — sends the code up to GitHub

---

## Phase 3 — AWS IAM User for Deployments

### Why not use your root AWS account?

Your root AWS account has unlimited power — it can delete everything, rack up huge bills, etc. GitHub Actions needs AWS credentials to deploy, but you don't want to hand it the keys to the kingdom. Instead, you create a dedicated IAM user with only the specific permissions it needs. This is called the **principle of least privilege** and is standard security practice.

### 3.1 Create an IAM user

- AWS Console → IAM → Users → Create User
- Name: `github-actions-justincodes`
- Attach these permission policies:
  - `AmazonS3FullAccess` — so it can upload files to S3
  - `CloudFrontFullAccess` — so it can invalidate the CDN cache after deploying

### 3.2 Create access keys

Access keys are like a username + password for programmatic access to AWS (CLI, scripts, GitHub Actions). They come in two parts that are always used together:

- **Access Key ID** — like a username (not secret on its own)
- **Secret Access Key** — like a password (treat this like a password, never share it or commit it to git)

- IAM user → Security credentials tab → Create access key
- Choose "Application running outside AWS"
- **Copy both values and save them somewhere safe** — AWS will only show the secret key once

### 3.3 Configure the AWS CLI locally

This stores your credentials on your laptop so the `aws` command knows who you are:

```bash
aws configure
```

It will prompt you for:
- Access Key ID
- Secret Access Key
- Default region: `us-east-1`
- Default output format: `json`

Test it worked:
```bash
aws s3 ls
```
This lists your S3 buckets. Should return empty (no buckets yet) rather than an error.

---

## Phase 4 — AWS Infrastructure

This is the core AWS setup. You only do this once.

### 4.1 Create the S3 Bucket

S3 (Simple Storage Service) is where your built `dist/` files will live. Think of it as a folder in the cloud that's accessible via the internet.

- AWS Console → S3 → Create bucket
- Bucket name: `justin-codes.com`
- Region: `us-east-1`
- **Uncheck** "Block all public access" — your site needs to be publicly readable
- Enable static website hosting:
  - Index document: `index.html`
  - Error document: `index.html`

> **Why `index.html` for the error document?** Your site is a React Single Page Application (SPA). All routing happens in the browser via React Router — there are no actual files at `/projects` or `/background` on the server. If someone navigates directly to `justin-codes.com/projects`, S3 looks for a file called `projects`, doesn't find it, and would normally return a 404 error. By setting the error document to `index.html`, S3 returns your React app instead, and React Router renders the right page. This is a critical setting for any React SPA.

### 4.2 Set the S3 Bucket Policy

A bucket policy is a JSON document that defines who can access your files and how. This one says "anyone on the internet can read any file in this bucket." Without this, your site would be private and nobody could see it.

Paste this in: S3 bucket → Permissions tab → Bucket Policy → Edit

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::justin-codes.com/*"
    }
  ]
}
```

### 4.3 Request an SSL Certificate in ACM

SSL (Secure Sockets Layer) is what makes `https://` work — it encrypts traffic between the user's browser and your server. The padlock icon in the browser means SSL is active. Without it, browsers show a "Not Secure" warning. AWS Certificate Manager issues these certificates for free.

- AWS Console → Certificate Manager
- **Critical: make sure you are in the `us-east-1` region** — CloudFront only accepts ACM certificates from us-east-1, regardless of where anything else lives
- Request a public certificate
- Add both domain names:
  - `justin-codes.com`
  - `www.justin-codes.com`
- Validation method: DNS validation

> **What is DNS validation?** AWS needs to prove you actually own the domain before issuing a certificate. It does this by asking you to add a specific CNAME record to your DNS. A CNAME is a type of DNS record that maps one name to another. Since your domain is already in Route 53, AWS can add this record automatically — click "Create records in Route 53." Wait a few minutes for the status to show **Issued**.

### 4.4 Create the CloudFront Distribution

CloudFront is Amazon's CDN (Content Delivery Network). Without it, everyone hits your S3 bucket in us-east-1 — someone in Tokyo gets a slower experience than someone in Virginia. CloudFront copies your files to ~400+ edge locations around the world and serves each user from the nearest one.

CloudFront also handles HTTPS — S3 static website hosting doesn't support HTTPS natively, which is another reason CloudFront is essential.

- AWS Console → CloudFront → Create distribution
- Origin domain: your **S3 static website endpoint** (looks like `justin-codes.com.s3-website-us-east-1.amazonaws.com` — use this URL format, not the S3 bucket ARN)
- Viewer protocol policy: **Redirect HTTP to HTTPS**
- Alternate domain names: `justin-codes.com` and `www.justin-codes.com`
- Custom SSL certificate: select the cert from ACM
- Default root object: `index.html`

Save the **CloudFront Distribution ID** (looks like `E1A2B3C4D5E6F7`) — you'll need it for GitHub Actions.

> CloudFront distributions take 10-15 minutes to deploy globally after creation. This is normal — it's propagating to hundreds of edge locations around the world.

### 4.5 Update Route 53 DNS

DNS (Domain Name System) is what translates `justin-codes.com` into an IP address a browser can connect to. Right now your DNS record points to the old site. We need to point it at CloudFront instead.

- Route 53 → Hosted zones → justin-codes.com
- Edit the `A` record for `justin-codes.com`:
  - Alias: Yes
  - Route traffic to: Alias to CloudFront distribution
  - Select your distribution
- Do the same for the `www` record

> **What is an Alias record?** It's a Route 53-specific feature. Normally a DNS `A` record maps a domain to a fixed IP address. But CloudFront doesn't have a fixed IP — it uses many IPs across its network. An Alias record lets you point a domain at a CloudFront distribution (or other AWS service) by name, and Route 53 handles the resolution automatically. Regular CNAMEs can't be used on root domains like `justin-codes.com` — only on subdomains like `www.justin-codes.com`. Alias records solve this.

DNS changes propagate across the internet in minutes to a few hours. Your old site may still appear during this window — that's normal.

---

## Phase 5 — GitHub Actions CI/CD

### What is CI/CD?

- **CI (Continuous Integration)** — every time you push code, it's automatically built and checked
- **CD (Continuous Deployment)** — if the build passes, it's automatically deployed to production

The end result: you make a change, push to GitHub, and within ~2 minutes the live site is updated. No manual steps.

### How GitHub Actions works

You write a workflow file in YAML (a simple structured text format) at `.github/workflows/deploy.yml`. GitHub reads this file and runs it automatically on every push to `main`. The workflow runs on a fresh virtual machine hosted by GitHub — it installs Node, builds your site, and uses the AWS CLI to deploy.

### 5.1 Add secrets to GitHub

Your workflow needs AWS credentials, but you can't put them in the code file — that would expose them publicly to anyone who sees your repo. GitHub has an encrypted secrets store for exactly this purpose. Secrets are only exposed to the workflow at runtime.

- GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Add these:

| Secret name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | From Phase 3.2 |
| `AWS_SECRET_ACCESS_KEY` | From Phase 3.2 |
| `AWS_REGION` | `us-east-1` |
| `S3_BUCKET` | `justin-codes.com` |
| `CLOUDFRONT_DISTRIBUTION_ID` | From Phase 4.4 |

### 5.2 Create the GitHub Actions workflow

Create this file: `.github/workflows/deploy.yml`

Claude will write the exact contents when you're ready. The workflow will:
1. Trigger on every push to `main`
2. Check out your code on a fresh virtual machine
3. Install Node.js and run `npm install`
4. Run `npm run build` to produce `dist/`
5. Sync `dist/` to S3 using the AWS CLI
6. Invalidate the CloudFront cache

> **What is a cache invalidation?** CloudFront caches your files at edge locations around the world. After uploading new files to S3, those edge caches still have the old versions. An invalidation tells CloudFront "forget your cached copies and fetch fresh ones from S3." Without this step, users might see the old version of your site for hours even after a successful deployment.

---

## Phase 6 — Testing the Pipeline

1. Make a small visible change (e.g. edit a line in `landing.md`)
2. Commit and push to `main`
3. Go to GitHub → Actions tab and watch the workflow run in real time
4. Once it shows a green checkmark, visit justin-codes.com and confirm the change is live

From push to live: roughly 1-2 minutes.

---

## How It All Fits Together

```
You edit code on your laptop
        ↓
git push to GitHub (main branch)
        ↓
GitHub Actions triggers automatically
        ↓
  [ Fresh virtual machine spins up ]
  npm install
  npm run build  →  dist/
  aws s3 sync dist/ → S3 bucket
  aws cloudfront create-invalidation
        ↓
CloudFront fetches fresh files from S3
        ↓
CloudFront serves files from edge locations worldwide
        ↓
User visits justin-codes.com → fast, secure, up to date
```

---

## What Happens When Something Goes Wrong?

- **Build fails** — GitHub Actions shows a red ✗. The old site stays live. Nothing is broken for users. Fix the error and push again.
- **S3 sync fails** — same thing. The old site stays up. Deployments are safe — a failed deploy never takes down what's already running.
- **Wrong files showing** — probably a CloudFront cache issue. You can manually trigger a cache invalidation from the AWS Console under CloudFront → your distribution → Invalidations.

This architecture is resilient by design. The live site keeps running until a new deployment fully succeeds.

---

## Ongoing Workflow (After Everything Is Set Up)

Once the infrastructure is in place, your day-to-day is simply:

```bash
# Make changes to the site
git add .
git commit -m "describe what you changed"
git push
```

That's it. GitHub Actions handles the rest automatically. The site is live in about 2 minutes.
