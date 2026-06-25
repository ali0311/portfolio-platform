# Deploy runbook

End-to-end setup notes for deploying the Personal Engineering Portfolio.
Architecture: **CloudFront + S3** for the frontend, **EC2 + Docker Compose + Nginx + Let's Encrypt** for the backend.

---

## What you'll provision in Phase 5 (one-time, AWS console)

### Frontend
1. **S3 bucket** — name e.g. `iamali-portfolio-web`. Block all public access (CloudFront reaches it via OAC).
2. **CloudFront distribution** — origin = the S3 bucket. SPA fallback: 403/404 → 200 + `/index.html`. Note the **Distribution ID** and **Default domain** (`d123abc.cloudfront.net`).
3. **IAM user** for GH Actions — programmatic access only. Policy attached: `AmazonS3FullAccess` scoped to your bucket + `cloudfront:CreateInvalidation` on your distribution. Save the access key ID + secret.

### Backend
1. **EC2 t3.micro** (Amazon Linux 2023). Allocate an **Elastic IP** and attach.
2. **Security Group** — inbound: SSH (22) from your IP only, HTTP (80) and HTTPS (443) from anywhere. Outbound: all.
3. **DuckDNS** — sign up at https://www.duckdns.org, claim a subdomain (e.g. `iamali-api`), point it at your Elastic IP. Save the DuckDNS token.
4. **SSH** in, install Docker + Docker Compose plugin + git, clone the repo to `/opt/portfolio` (or any path).
5. **Copy `portfolio-platform-api/.env.production.example` → `.env`** at the repo root, fill it in. Update `FRONTEND_ORIGIN` to your CloudFront domain.
6. **Edit `infra/nginx/nginx.prod.conf`** — replace `iamali.duckdns.org` with your real DuckDNS subdomain.
7. **Issue Let's Encrypt cert** (one-time, no auto-renew yet — Phase 7 we'll add the cron):
   ```bash
   docker run --rm -p 80:80 \
     -v $PWD/infra/letsencrypt:/etc/letsencrypt \
     certbot/certbot certonly --standalone \
     -d iamali.duckdns.org \
     --email you@example.com --agree-tos --no-eff-email
   ```
8. **Boot the stack**:
   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env up -d --build
   ```
9. **Update Vite build target** — set CloudFront's domain in [.env.production](portfolio-platform-web/.env.production) `VITE_API_URL` and rebuild.

---

## GitHub repo secrets (add at Settings → Secrets and variables → Actions)

### Frontend deploy
| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | from IAM user above |
| `AWS_SECRET_ACCESS_KEY` | from IAM user above |
| `AWS_REGION` | e.g. `us-east-1` |
| `S3_BUCKET` | e.g. `iamali-portfolio-web` |
| `CLOUDFRONT_DISTRIBUTION_ID` | e.g. `E3ABCDEF12345` |
| `VITE_API_URL` | e.g. `https://iamali.duckdns.org` |

### Backend deploy
| Secret | Value |
|---|---|
| `EC2_HOST` | the EC2 Elastic IP (or DuckDNS subdomain) |
| `EC2_USER` | `ec2-user` (Amazon Linux default) |
| `EC2_SSH_KEY` | the **private key** contents (the `.pem` file you downloaded) |
| `EC2_APP_PATH` | path on the server where you cloned the repo, e.g. `/opt/portfolio` |

---

## Workflows

| File | Triggers on | Does |
|---|---|---|
| `.github/workflows/ci.yml` | every PR + push to main | npm install + build for both apps + `prisma generate` |
| `.github/workflows/deploy-frontend.yml` | push to main when `portfolio-platform-web/**` changes | Vite build → S3 sync → CloudFront invalidate |
| `.github/workflows/deploy-backend.yml` | push to main when `portfolio-platform-api/**` or compose / infra changes | SSH into EC2 → `git pull` → `docker compose up -d --build` |

Manual triggers also available via the Actions tab → workflow → "Run workflow."

---

## First-time deploy order

1. Provision all AWS resources (frontend + backend lists above).
2. Add all GitHub secrets.
3. Push to `main`. Both deploy workflows will fire.
4. Wait ~3 minutes (CloudFront invalidations are slowest).
5. Open the CloudFront URL → see the live portfolio.
6. Click View Resume → Network tab shows analytics POST → DuckDNS URL → `201`.
7. Login at `/login` with the seeded admin credentials → `/dashboard` should populate.

---

## Daily flow afterwards

```bash
# Make changes locally
git commit -am "..."
git push origin main
# → CI runs, deploys fire automatically
```

For a manual restart on EC2 (without code changes):
```bash
ssh ec2-user@<elastic-ip>
cd /opt/portfolio
docker compose -f docker-compose.prod.yml --env-file .env restart
```

For tailing prod logs:
```bash
docker compose -f docker-compose.prod.yml logs -f api
```

---

## Cost estimate

| Service | Monthly |
|---|---|
| EC2 t3.micro | ~$7.50 |
| EC2 storage (8GB gp3) | ~$0.65 |
| Elastic IP (attached to running EC2) | $0.00 |
| S3 (well under 5GB) | ~$0.10 |
| CloudFront (well under 1TB egress) | ~$0.00 (free tier) |
| ACM cert (default CloudFront cert) | $0.00 |
| **Total** | **~$8/month** |

---

## Phase 7 hardening (deferred)

- Auto-renew Let's Encrypt cert via cron + certbot
- Daily Postgres dump → S3 with lifecycle expiry
- CloudWatch agent on EC2 forwarding api logs
- Restrict EC2 security group inbound 22 to your IP only (already in plan)
- Rotate `JWT_SECRET` periodically
- Set up CloudFront Function for security headers (CSP, HSTS, etc.)
