# Hosting techlogicq.in on AWS EC2 with Jenkins

What you end up with:

- One Ubuntu EC2 instance running the Next.js site (port 3000, systemd service `techlogicq`), nginx in front of it, and Jenkins.
- `https://techlogicq.in` serves the site, `https://www.techlogicq.in` redirects to it. Free Let's Encrypt SSL that renews itself.
- `https://jenkins.techlogicq.in` is the Jenkins UI. Every push to `main` on GitHub triggers a build and deploy.
- Nothing is added to the repo: the Jenkinsfile is pasted into the Jenkins job.

> Commands are for **Ubuntu 24.04**. Run them on the server after `ssh`-ing in. Lines starting with `#` are comments.

---

## Step 1. Launch the EC2 instance

AWS Console → EC2 → **Launch instance**:

| Setting | Value |
| --- | --- |
| Name | `techlogicq-web` |
| AMI | Ubuntu Server 24.04 LTS (x86_64) |
| Instance type | **t3.small** (2 GB RAM) minimum. Jenkins + `next build` will run out of memory on t2/t3.micro. t3.medium is more comfortable. |
| Key pair | Create one (e.g. `techlogicq-key`), download the `.pem` |
| Storage | 30 GB gp3 |

**Security group** (inbound rules):

| Type | Port | Source |
| --- | --- | --- |
| SSH | 22 | My IP |
| HTTP | 80 | 0.0.0.0/0 |
| HTTPS | 443 | 0.0.0.0/0 |

Do **not** open 3000 or 8080; nginx handles everything on 80/443.

**Elastic IP** (so the IP never changes): EC2 → Elastic IPs → Allocate → Actions → Associate → pick `techlogicq-web`. Note this IP, it's `<ELASTIC_IP>` below.

Connect:

```bash
chmod 400 techlogicq-key.pem
ssh -i techlogicq-key.pem ubuntu@<ELASTIC_IP>
```

## Step 2. Point GoDaddy DNS at the server

**Already done:** the "TEMPLATE APPLIED: LOVABLE" template has been removed (it pointed `@` and `www` at Lovable's IP 185.158.133.1). The records are unlocked now.

**Current records (5 Oct 2026):**

| Type | Name | Data | Action |
| --- | --- | --- | --- |
| A | `@` | Parked | **Edit** → `<ELASTIC_IP>`, TTL 600 |
| A | `evalora` | 54.252.4.25 | Leave alone |
| CNAME | `www` | `techlogicq.in.` | Leave alone (follows `@`, works with certbot) |
| NS / SOA | `@` | ns45/ns46.domaincontrol.com | Leave alone |
| CNAME | `_domainconnect` | `_domainconnect.gd.domaincontrol.com.` | Leave alone |
| TXT | `_dmarc` | v=DMARC1; ... | Leave alone |

**Add one record:**

| Type | Name | Data | TTL |
| --- | --- | --- | --- |
| A | `jenkins` | `<ELASTIC_IP>` | 600 seconds |

**Which IP is `<ELASTIC_IP>`?** AWS Console → EC2 → **Elastic IPs** (same region as the instance). Copy the one associated with your instance, or **Allocate Elastic IP address** → **Actions → Associate** → pick the instance. Use an Elastic IP, not the auto-assigned public IP (that changes whenever the instance stops).

> **Don't use 3.33.130.190 or 15.197.148.33.** Those are GoDaddy's parking-page addresses (what "Parked" resolves to), not your server.

> **Sharing the Evalora server?** If TechLogicQ goes on the same instance as Evalora, `<ELASTIC_IP>` is **54.252.4.25**. See the "Sharing a server with Evalora" notes in Steps 4 and 6.

Check from your laptop (usually a few minutes, up to an hour):

```bash
dig +short techlogicq.in           # must print <ELASTIC_IP>
dig +short www.techlogicq.in       # prints techlogicq.in. then <ELASTIC_IP>
dig +short jenkins.techlogicq.in   # must print <ELASTIC_IP>
```

All three must end in `<ELASTIC_IP>` before Step 7 (SSL).

## Step 3. Base packages, swap, Node.js 22

```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install git curl nginx ufw fontconfig openjdk-21-jre

# 2 GB swap so builds don't get killed on a small instance
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt -y install nodejs
node -v   # v22.x
```

Firewall (optional, the security group already does this):

```bash
sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw --force enable
```

## Step 4. Install Jenkins

```bash
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" \
  | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update && sudo apt -y install jenkins

# Listen only on localhost; nginx will expose it at jenkins.techlogicq.in
sudo mkdir -p /etc/systemd/system/jenkins.service.d
printf '[Service]\nEnvironment="JENKINS_LISTEN_ADDRESS=127.0.0.1"\n' | sudo tee /etc/systemd/system/jenkins.service.d/override.conf
sudo systemctl daemon-reload && sudo systemctl enable --now jenkins
sudo systemctl status jenkins --no-pager
```

> **Sharing a server with Evalora:** before installing, check nothing already uses ports 8080 or 3000: `sudo ss -ltnp | grep -E ':(8080|3000) '`. If Jenkins is already installed for Evalora, skip this step and reuse it (just add the new job in Step 9). If port 3000 is taken, pick another port (e.g. 3001) and change it in the service file (Step 5), `proxy_pass` (Step 6) and the Jenkinsfile health check.

> If `apt update` complains about the Jenkins key, use the current key URL from https://www.jenkins.io/doc/book/installing/linux/#debianubuntu (they rotate it occasionally).

## Step 5. App folder, production env file, systemd service

```bash
# Where releases live; Jenkins owns it
sudo mkdir -p /var/www/techlogicq/releases
sudo chown -R jenkins:jenkins /var/www/techlogicq

# Production secrets (readable by Jenkins only)
sudo mkdir -p /etc/techlogicq
sudo nano /etc/techlogicq/techlogicq.env
```

Paste and fill in (same values you use on Vercel):

```bash
NEXT_PUBLIC_SITE_URL=https://techlogicq.in
ADMIN_SESSION_SECRET=<openssl rand -hex 32>
SMTP_USER=gowrisankarv.work@gmail.com
SMTP_PASS=<16-char Google App Password>
CONTACT_TO_EMAIL=gowrisankarv.work@gmail.com
MONGODB_URI=<your Atlas connection string>
MONGODB_DB=techlogicq
```

> `NEXT_PUBLIC_SITE_URL` matters: without it the code falls back to `https://www.techlogicq.com` (wrong domain) in canonical links, Open Graph tags and the sitemap. It's baked in at build time, so the Jenkinsfile copies this file in before `npm run build`.

```bash
sudo chown root:jenkins /etc/techlogicq/techlogicq.env
sudo chmod 640 /etc/techlogicq/techlogicq.env
```

Systemd service that runs whatever release `current` points to:

```bash
sudo tee /etc/systemd/system/techlogicq.service > /dev/null <<'EOF'
[Unit]
Description=TechLogicQ Next.js website
After=network.target

[Service]
User=jenkins
Group=jenkins
WorkingDirectory=/var/www/techlogicq/current
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/node node_modules/next/dist/bin/next start -p 3000 -H 127.0.0.1
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable techlogicq   # first start happens on the first Jenkins deploy
```

Let Jenkins restart the site (and nothing else) without a password:

```bash
echo 'jenkins ALL=(root) NOPASSWD: /usr/bin/systemctl restart techlogicq' | sudo tee /etc/sudoers.d/jenkins-techlogicq
sudo chmod 440 /etc/sudoers.d/jenkins-techlogicq
sudo visudo -c
```

## Step 6. nginx reverse proxy

```bash
sudo tee /etc/nginx/sites-available/techlogicq > /dev/null <<'EOF'
# www -> apex
server {
    listen 80;
    server_name www.techlogicq.in;
    return 301 https://techlogicq.in$request_uri;
}

server {
    listen 80;
    server_name techlogicq.in;

    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 80;
    server_name jenkins.techlogicq.in;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_read_timeout 90s;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/techlogicq /etc/nginx/sites-enabled/techlogicq
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

> **Sharing a server with Evalora:** skip the `rm -f /etc/nginx/sites-enabled/default` line if Evalora's site lives in that file (check with `ls /etc/nginx/sites-enabled/` and `grep server_name /etc/nginx/sites-enabled/*`). If Jenkins already has its own hostname there, drop the `jenkins.techlogicq.in` block. Each site is matched by `server_name`, so the two sites don't clash.

## Step 7. SSL with Let's Encrypt

Only after `dig` from Step 2 shows your Elastic IP for all three names:

```bash
sudo apt -y install certbot python3-certbot-nginx
sudo certbot --nginx \
  -d techlogicq.in -d www.techlogicq.in -d jenkins.techlogicq.in \
  -m gowrisankarv.work@gmail.com --agree-tos --redirect -n
sudo certbot renew --dry-run   # confirms auto-renewal works
```

Certbot adds the 443 blocks and HTTP→HTTPS redirects for you. After this, `http://www...` → `https://www...` → `https://techlogicq.in`.

## Step 8. Allow the server in MongoDB Atlas

Atlas → **Network Access** → Add IP Address → `<ELASTIC_IP>/32`. (If you keep Vercel running too, keep its `0.0.0.0/0` entry.)

## Step 9. Set up Jenkins

1. Open `https://jenkins.techlogicq.in`. Get the unlock password:
   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```
2. **Install suggested plugins** (includes Git, GitHub, Pipeline). Create your admin user. Set the Jenkins URL to `https://jenkins.techlogicq.in/`.
3. **GitHub token**: GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained token** → Repository access: only `TechLogicQ-Website` → Permissions: **Contents: Read-only**. Copy it.
4. Jenkins → Manage Jenkins → **Credentials** → System → Global → Add Credentials:
   - Kind: **Username with password**
   - Username: `gowrisankarv-work`
   - Password: the token
   - **ID: `github-techlogicq`** (the Jenkinsfile uses this exact ID)
5. **New Item** → name `techlogicq-website` → **Pipeline** → OK.
   - Under **Triggers**, tick **GitHub hook trigger for GITScm polling**.
   - Under **Pipeline**, Definition: **Pipeline script**, paste the whole `Jenkinsfile`. Leave "Use Groovy Sandbox" ticked.
   - Save.
6. Click **Build Now**. The first build installs, lints, builds, creates `/var/www/techlogicq/releases/1`, points `current` at it and starts the site. Watch **Console Output**.

Check on the server:

```bash
systemctl status techlogicq --no-pager
curl -I http://127.0.0.1:3000
```

Then open https://techlogicq.in and https://www.techlogicq.in.

## Step 10. Auto-deploy on every push (GitHub webhook)

GitHub → `TechLogicQ-Website` → Settings → **Webhooks** → Add webhook:

| Field | Value |
| --- | --- |
| Payload URL | `https://jenkins.techlogicq.in/github-webhook/` (trailing slash required) |
| Content type | `application/json` |
| Events | Just the push event |

Save; GitHub should show a green tick on the ping. Now push to `main` and the job runs by itself.
(The `githubPush()` trigger in the Jenkinsfile only registers after the first manual build, which you did in Step 9.)

## Step 11. Create the admin login (only if not already in MongoDB)

If you already ran `npm run create-admin` against the same Atlas database, skip this. Otherwise:

```bash
sudo -u jenkins bash -c 'cd /var/lib/jenkins/workspace/techlogicq-website && set -a && . /etc/techlogicq/techlogicq.env && set +a && node scripts/create-admin.mjs'
```

---

## How a deploy works

`Checkout → npm ci → lint → build (with the production env) → copy into releases/<build number> → switch the current symlink → restart → health check on 127.0.0.1:3000`.
If the health check fails, the post step switches `current` back to the previous release and restarts. The last 3 releases are kept.

## Everyday commands

| What | Command |
| --- | --- |
| Site logs | `journalctl -u techlogicq -f` |
| Restart site | `sudo systemctl restart techlogicq` |
| Manual rollback | `ls /var/www/techlogicq/releases` then `sudo ln -sfn /var/www/techlogicq/releases/<N> /var/www/techlogicq/current && sudo systemctl restart techlogicq` |
| Change an env var | edit `/etc/techlogicq/techlogicq.env`, then **Build Now** in Jenkins (the build copies it in) |
| nginx logs | `sudo tail -f /var/log/nginx/error.log` |

## Troubleshooting

- **Build killed / "JavaScript heap out of memory"**: instance too small. Check swap is on (`free -h`) or move to t3.medium.
- **502 Bad Gateway**: the app isn't running. `journalctl -u techlogicq -n 50`.
- **Certbot fails**: DNS isn't pointing at the Elastic IP yet, or port 80 isn't open in the security group.
- **Contact form doesn't send**: check `SMTP_PASS` is a Google App Password. Port 465 outbound works on EC2 (AWS only throttles port 25).
- **Admin/careers errors**: Atlas Network Access doesn't include the Elastic IP.
- **Webhook shows 403/404**: Payload URL must end in `/github-webhook/` and the job must have been built once.
