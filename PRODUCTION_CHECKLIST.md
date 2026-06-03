# PRODUCTION CHECKLIST

> 把你手里这份 MindMirror 推到公网、让真用户能用的清单。
> 预计 60–90 分钟,如果你已经买了域名和 VPS,可以更短。
> 命令里的 `你的域名` / `你的服务器 IP` / `你的邮箱` 全部要替换成真值。

---

## 第 0 步 · 自检当前代码 ✅(你看到这一节时应该已经全过)

```bash
cd MindMirror

# 后端
cd backend && pip install -r requirements.txt
python3 -m pytest -q            # 期望:48 passed
cd ..

# 前端
npm ci
npm run typecheck               # 期望:0 errors
npm run lint                    # 期望:0 errors
npx prettier --check "src/**/*.{ts,tsx}"   # 期望:clean
npm run build                   # 期望:built in dist/
```

如果任何一步红,先看终端输出,**不要**带着红状态进生产。

---

## 第 1 步 · 准备一台服务器(~10 分钟)

| 选项                                                   | 推荐       | 费用    |
| ------------------------------------------------------ | ---------- | ------- |
| **Hetzner CX22** (2 vCPU / 4 GB / 40 GB SSD,德国/芬兰) | ⭐ 最划算  | €4.5/月 |
| **Vultr** (1 vCPU / 1 GB / 25 GB,日本/美国)            | 离中国近   | $6/月   |
| **DigitalOcean** basic droplet                         | 文档多     | $6/月   |
| **阿里云 / 腾讯云** ECS 1c2g                           | 国内访问快 | ¥50+/月 |

> ⚠️ 1 GB 内存跑得动,但**会很挤**;2 GB 是舒服的下限。
> 操作系统选 **Ubuntu 24.04 LTS**。

买好之后,记下:

- 服务器公网 IP(下面叫 `<SERVER_IP>`)
- 你的域名(下面叫 `<YOUR_DOMAIN>`)
- 域名注册商控制面板的 DNS 编辑入口

在域名注册商那里加这两条记录:

| 类型 | 主机  | 值            |
| ---- | ----- | ------------- |
| A    | `@`   | `<SERVER_IP>` |
| A    | `www` | `<SERVER_IP>` |

> 等 DNS 生效(1–30 分钟),`ping <YOUR_DOMAIN>` 应该解析到 `<SERVER_IP>`。

---

## 第 2 步 · 第一次连上服务器(~5 分钟)

```bash
# 本地机器
ssh root@<SERVER_IP>

# 1. 建一个非 root 用户
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
exit

# 2. 以后都用 deploy 登
ssh deploy@<SERVER_IP>

# 3. 装基础包
sudo apt update && sudo apt upgrade -y
sudo apt install -y ufw fail2ban curl git unattended-upgrades

# 4. 打开防火墙
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 5. 装 Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker deploy
# 退出重登一次,使 docker 组生效
exit
ssh deploy@<SERVER_IP>
docker --version   # 确认装好
```

---

## 第 3 步 · 部署代码 + 配环境变量(~10 分钟)

```bash
# 1. clone
cd ~
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

# 2. 改 CORS、密钥等
cp .env.example .env
nano .env
```

把 `.env` 改成下面这样(把三个 `<CHANGE_ME>` 替换掉):

```dotenv
POSTGRES_USER=mindmirror
POSTGRES_PASSWORD=<CHANGE_ME_1>           # 见下面 "生成密钥" 命令
POSTGRES_DB=mindmirror
SECRET_KEY=<CHANGE_ME_2>                  # 见下面
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CORS_ORIGIN=https://<YOUR_DOMAIN>         # 必须 https,不能是 *
ENVIRONMENT=production                    # 关键:触发严格启动检查
VITE_API_BASE_URL=https://<YOUR_DOMAIN>   # 告诉前端 API 在哪
FRONTEND_PORT=80
```

生成密钥:

```bash
echo "POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)"
echo "SECRET_KEY=$(python3 -c 'import secrets;print(secrets.token_urlsafe(64))')"
```

把输出粘到 `.env` 里,Ctrl+O 保存,Ctrl+X 退出。

```bash
# B. 启动
docker compose up -d --build

# C. 第一次启动灌测评题库(Big Five / PSS-30 / GAD-7+,共 121 题)
#    默认 init_db.py 会自动 seed 测评题库,但需要显式触发:
docker compose exec backend python init_db.py
# (这是幂等的,以后再跑也不会重复插入)

# D. 灌演示用户(非 production 才有效,production 会被自动跳过)
docker compose exec backend python init_db.py --seed

# E. 看启动日志
docker compose logs -f --tail=50
# 应该看到:postgres "database system is ready to accept connections"
#         backend  "Application startup complete"
#         frontend "start worker process"
# Ctrl+C 退出(服务在后台跑)
```

```bash
# 5. 健康检查
curl http://<YOUR_DOMAIN>/healthz      # nginx 应答 ok
curl http://<YOUR_DOMAIN>/api/v1/      # FastAPI 根路由
docker compose ps                       # 三服务都 healthy
```

此时用浏览器访问 `http://<YOUR_DOMAIN>` 应该能看到登录页,但是**还没 HTTPS,Chrome 会标不安全**。下一步解决。

---

## 第 4 步 · 套 Caddy 自动 HTTPS(~5 分钟)

[Caddy](https://caddyserver.com) 会自动申请和续期 Let's Encrypt 证书,nginx 不动,只监听 127.0.0.1。

```bash
# 1. 装 Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/deb/debian.any-version.any-release.any-architecture.list' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy

# 2. 改 Caddy 配置
sudo nano /etc/caddy/Caddyfile
```

把文件**整个替换**成:

```caddyfile
<YOUR_DOMAIN>, www.<YOUR_DOMAIN> {
    reverse_proxy 127.0.0.1:80
    encode gzip zstd
}
```

```bash
# 3. 启动
sudo systemctl enable --now caddy

# 4. 验证(30 秒内证书就会签下来)
curl -I https://<YOUR_DOMAIN>
# 期望看到 HTTP/2 200 和 Strict-Transport-Security 等头

# 5. 现在再用浏览器访问,锁头应该绿了
```

---

## 第 5 步 · 注册你的第一个真实账号(~1 分钟)

```bash
# API 已经在 HTTPS 后面,直接打
curl -X POST https://<YOUR_DOMAIN>/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"你@你的域名","username":"admin","password":"至少12位强密码"}'
```

或者直接打开 `https://<YOUR_DOMAIN>/register` 在网页上注册。

登录后,你能看到:

- ✅ 首页 (Dashboard)
- ✅ 测评列表 (Big Five / PSS-10 / GAD-7)
- ✅ 心情记录
- ✅ 历史 / 训练计划 / 成就
- ✅ 中英文切换
- ✅ 暗色主题

---

## 第 6 步 · 数据备份(每天一次,~5 分钟设置 + 长期跑)

```bash
mkdir -p ~/backups
nano ~/backup.sh
```

粘进去:

```bash
#!/bin/bash
set -e
TS=$(date -u +%Y%m%dT%H%M%SZ)
docker exec mindmirror_postgres pg_dump -U mindmirror -d mindmirror \
  | gzip > ~/backups/db-$TS.sql.gz
# 保留 14 天
find ~/backups -name 'db-*.sql.gz' -mtime +14 -delete
```

```bash
chmod +x ~/backup.sh

# 每天凌晨 3 点跑
crontab -e
# 加这一行:
0 3 * * * /home/deploy/backup.sh >> /home/deploy/backups/cron.log 2>&1
```

```bash
# 立刻测一次
~/backup.sh
ls -lh ~/backups/
```

**强建议**:再把 `~/backups/` 同步到 S3 / Backblaze B2 / Google Drive。本地磁盘丢了一样完蛋。

```bash
# 最简单的方案:用 restic + Backblaze B2(5 GB 免费)
# 文档:https://restic.net/
```

---

## 第 7 步 · 监控和告警(~10 分钟)

**7.1 服务挂掉提醒** —— UptimeRobot(免费,5 分钟检查一次)

1. 打开 https://uptimerobot.com 注册
2. Add New Monitor → HTTP(s) → URL: `https://<YOUR_DOMAIN>/healthz`
3. 挂了就发邮件 / 钉钉 / Slack webhook

**7.2 错误追踪** —— GlitchTip(免费,自托管版 Sentry)

不是必须;MVP 阶段只看 UptimeRobot + Docker 日志就够了:

```bash
# 看实时日志
docker compose logs -f --tail=100

# 只看后端报错
docker compose logs -f backend 2>&1 | grep -i 'error\|traceback\|500'
```

**7.3 自动安全更新**

```bash
sudo dpkg-reconfigure -plow unattended-upgrades
# 选 "Yes",然后保持默认(只装 security 源)
```

---

## 第 8 步 · 上线后常规操作

| 你想做          | 命令                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| 拉新代码 + 重启 | `cd ~/MindMirror && git pull && docker compose up -d --build`                                              |
| 看日志          | `docker compose logs -f --tail=100`                                                                        |
| 进数据库 shell  | `docker exec -it mindmirror_postgres psql -U mindmirror -d mindmirror`                                     |
| 备份            | `~/backup.sh`                                                                                              |
| 恢复一个备份    | `gunzip -c ~/backups/db-XXX.sql.gz \| docker exec -i mindmirror_postgres psql -U mindmirror -d mindmirror` |
| 停服            | `cd ~/MindMirror && docker compose down`                                                                   |
| 删库(危险)      | `docker compose down -v`                                                                                   |

---

## 验收清单(可勾)

上线之前**所有**这些都应该是 ✅:

- [ ] 第 0 步全部命令本地通过
- [ ] 第 2 步服务器能 SSH 登录,非 root,ufw 开启
- [ ] 第 3 步 `docker compose ps` 三服务 healthy
- [ ] `curl https://<YOUR_DOMAIN>/healthz` 返回 `ok`
- [ ] `curl https://<YOUR_DOMAIN>/api/v1/` 返回 200
- [ ] 浏览器打开 `https://<YOUR_DOMAIN>` 是绿锁
- [ ] 浏览器能注册、登录、做测评、记录心情
- [ ] 第 6 步 `~/backup.sh` 至少成功跑过一次
- [ ] UptimeRobot 监控加好
- [ ] 你能从备份恢复一次到本地 docker(演练)

---

## 上线**之后**才该想的事(留个 TODO 给你自己)

| 优先级 | 事项                        | 备注                                 |
| ------ | --------------------------- | ------------------------------------ |
| 中     | 接 Sentry / GlitchTip       | 错误聚合                             |
| 中     | 接 Resend / Postmark 做邮件 | 现在注册没邮箱验证,密码重置也是 stub |
| 中     | 加 Privacy Policy 页        | 欧盟 GDPR / 中国 PIPL 都要           |
| 低     | 加 Cookie banner            | 看你加不加分析(目前没有)             |
| 低     | 拆前后端到不同子域          | api.<YOUR_DOMAIN>,scale 起来再说     |
| 低     | 加 Redis 做限流             | slowapi 当前是内存,多副本不共享      |
| 低     | 拆 postgres 到托管          | Supabase / Neon / RDS                |

---

## 出问题怎么办

| 症状              | 第一件事                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| 网站打不开        | `docker compose ps` 看三个服务是不是 healthy;`docker compose logs backend` 看后端报错                      |
| 502 Bad Gateway   | nginx 起来了但 backend 没起来;等 30 秒,或者 `docker compose restart backend`                               |
| HTTPS 证书没下来  | Caddy 日志 `journalctl -u caddy -f`;通常是 80 端口被挡或 DNS 没生效                                        |
| 忘记 SECRET_KEY   | 旧的 token 全部失效,用户要重新登录。改 `.env` 后 `docker compose restart backend`                          |
| postgres 数据丢了 | `gunzip -c ~/backups/db-XXX.sql.gz \| docker exec -i mindmirror_postgres psql -U mindmirror -d mindmirror` |
| 改 .env 没生效    | `docker compose up -d --force-recreate backend`                                                            |

---

_这份清单是按"我"来 MindMirror 的现实约束写的:一台 1c2g VPS、Postgres 不拆、纯静态前端、域名 + Caddy + 备份能覆盖 99% 的真实需求。如果你之后要接 OAuth、邮件、对象存储,先告诉我接哪个,我再补一节。_
