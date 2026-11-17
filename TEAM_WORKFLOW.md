# 团队协作工作流

> 配套阅读：`GIT_SETUP.md`（网络与认证配置说明）

## 现状

- 远端仓库：`https://github.com/chujizhe214/QMZY.git`（公开）
- 我的 GitHub 账号：`chujizhe214`
- 我的本地仓库：`C:/Users/26501/Desktop/GEO/QMZY`
- 已创建的分支：`feature/chujizhe214-dev`（远端已存在，已建立跟踪）
- SSH 认证：✅ 可用（`~/.ssh/id_ed25519_github`）

## 分支命名规范

组里多人并行开发时，分支名带上 GitHub 用户名，避免撞名、方便识别归属：

```
feature/chujizhe214-<功能简述>     # 功能开发
fix/chujizhe214-<问题简述>         # 修 bug
exp/chujizhe214-<实验简述>          # 实验性探索
chore/chujizhe214-<杂项简述>        # 配置、依赖、文档等杂务
```

**命名要求**：只用小写字母、数字、连字符；功能简述控制在 3-5 个词内。

举例：`feature/chujizhe214-pgvector`、`fix/chujizhe214-order-total`、`exp/chujizhe214-agent-eval`

## 日常开发流程

### 1. 开始新功能

```bash
cd C:/Users/26501/Desktop/GEO/QMZY

git checkout main                 # 回到主干
git pull                          # 拉取队友的最新提交
git checkout -b feature/chujizhe214-<功能简述>
git push -u origin feature/chujizhe214-<功能简述>   # 首次推送并建立跟踪
```

`git push -u` 只需首次执行一次，之后直接 `git push` 即可（已验证）。

### 2. 开发过程中

```bash
git status                        # 看改动
git add <具体文件>                # 只 add 你要提交的文件
git commit -m "feat: xxx"        # 提交
git push                          # 推送到你的分支
```

**提交信息约定**（沿用仓库现有风格）：

```
feat: 新增 xxx 功能
fix: 修复 xxx 问题
refactor: 重构 xxx
chore: 更新依赖/配置
docs: 补充文档
```

### 3. 同步队友进度

```bash
git fetch origin                  # 拉取所有远端分支的最新引用
git branch -r                     # 查看远端有哪些分支
git checkout <队友分支名>          # 切过去看他的代码
```

### 4. 合并到主干（提 PR）

在 GitHub 网页上操作：

1. 打开仓库 → **Pull requests** → **New pull request**
2. base 选 `main`，compare 选你的分支
3. 检查改动内容，写清楚 PR 描述
4. 创建后通知组员 review

命令辅助：

```bash
# 推送前自检：看我的分支相对 main 多了什么
git log main..HEAD --oneline
git diff main...HEAD --stat

# 想把队友的分支合并进我的分支
git merge <队友分支名>
```

### 5. 合并后清理

```bash
git checkout main
git pull
git branch -d feature/chujizhe214-<功能简述>        # 删本地分支
git push origin --delete feature/chujizhe214-<功能简述>  # 删远端分支
```

## 常用命令速查

| 场景 | 命令 |
|------|------|
| 看当前状态 | `git status -sb` |
| 看分支及跟踪关系 | `git branch -vv` |
| 看远端所有分支 | `git branch -r` |
| 看我的分支比 main 多了什么提交 | `git log main..HEAD --oneline` |
| 看改动统计 | `git diff main...HEAD --stat` |
| 撤销未提交的改动 | `git restore <文件>` |
| 撤销上一次 commit（未推送） | `git reset --soft HEAD~1` |
| 临时切换到别的分支 | `git stash` 存起来 / `git stash pop` 取回 |

## 注意事项

- **别直接在 `main` 上提交**。`main` 保持干净，所有开发都在自己分支上。
- **commit 勤一点**，别攒一大堆改动再提交，方便回滚和 review。
- **push 前自检**：`git status` 看有没有误提交敏感文件（如 `application.yml` 里的数据库密码、`DEEPSEEK_API_KEY`）。
  当前 `.gitignore` 内容需要确认是否覆盖了 `target/`、`.env` 等。
- **网络偶发抖动**：直连 GitHub 偶尔会 `Connection was reset`，重跑一次 `git fetch` / `git push` 即可，
  这是网络问题不是配置问题。
