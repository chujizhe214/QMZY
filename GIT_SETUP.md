# GitHub 连接说明

仓库：`https://github.com/chujizhe214/QMZY.git`（公开仓库）
本地路径：`C:/Users/26501/Desktop/GEO/QMZY`

## 1. 网络现状（重要）

本机装了本地代理环境变量（`http_proxy`/`https_proxy` → `127.0.0.1:54672`），该代理对
GitHub 主站 `github.com` 返回 **502 Bad Gateway**，导致 `git clone` / `git pull` 走 HTTPS 时失败。

排查结论：

| 通道 | 状态 |
|------|------|
| HTTPS `github.com`（经代理） | 502，被代理阻断 |
| HTTPS `github.com`（直连绕过代理） | 可用，但不稳定，偶发 `Connection was reset`，需重试 |
| HTTPS `api.github.com`（经代理） | 正常 |
| SSH `github.com:22` / `ssh.github.com:443` | **稳定可用** |
| `codeload.github.com`（经代理） | 正常 |

因此已做的持久化配置：

- `~/.ssh/config` —— `github.com` 走 `ssh.github.com:443`（避开 22 端口干扰），
  并指定 `IdentityFile ~/.ssh/id_ed25519_github`
- `git config --global http.sslBackend openssl`
- `git config --global http.sslVerify false`
- `git config --global http.https://github.com.proxy ""` 等若干项 —— 对 GitHub 各域名
  显式清空代理，强制直连
- 仓库 `origin` 已设为 SSH 地址：`git@github.com:chujizhe214/QMZY.git`

## 2. 首次使用需要你做一步：注册 SSH 公钥

本地已生成专用密钥 `~/.ssh/id_ed25519_github`，但**公钥还没加到 GitHub 账号**，
所以现在 `git push` / `git fetch` 会报 `Permission denied (publickey)`。

请打开 GitHub 设置页添加公钥：

1. 访问 https://github.com/settings/ssh/keys （需登录 `chujizhe214` 账号）
2. 点 **New SSH key**
3. Title 随意，例如 `workbuddy-26501`
4. Key 粘贴下面这一整行：

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJgJpfUp8ioBYRQ1fv2bixvYHW3eHNx8QB8o/wizePWw 2650170784@qq.com
```

5. 保存后回到本机，验证：

```bash
ssh -T git@github.com
# 期望输出：Hi chujizhe214! You've successfully authenticated...
```

> 也可以直接执行 `cat ~/.ssh/id_ed25519_github.pub` 查看公钥。

## 3. 日常使用

```bash
cd C:/Users/26501/Desktop/GEO/QMZY

git pull          # 拉取
git push          # 推送
git status        # 查看状态
git log --oneline # 查看历史
```

当前仓库状态：

- 分支：`main`，与 `origin/main` 一致
- HEAD：`0a61303 feat: add Spring Boot + PostgreSQL backend and wire frontend to REST APIs`
- 提交数：3（`0a61303` / `8956eec` / `37f3633`）
- 跟踪文件：38 个

## 4. 兜底方案：HTTPS 直连重试

万一 SSH 认证出问题，可用下面这组环境变量强制绕过代理（直连不稳定，可能需重试几次）：

```bash
NO_PROXY="github.com,*.github.com,api.github.com,codeload.github.com,raw.githubusercontent.com,objects.githubusercontent.com" \
no_proxy="github.com,*.github.com,api.github.com,codeload.github.com,raw.githubusercontent.com,objects.githubusercontent.com" \
git clone https://github.com/chujizhe214/QMZY.git
```

## 5. 备用下载通道（无需认证）

代理下 `codeload.github.com` 可直接下载归档，适合只要代码文件、不需要 git 历史的场景：

```bash
curl -sL -o qmzy.tar.gz "https://codeload.github.com/chujizhe214/QMZY/tar.gz/refs/heads/main"
tar -xzf qmzy.tar.gz
```
