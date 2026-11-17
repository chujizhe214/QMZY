# 透镜 GEO · 产品原型（含后端）

GEO（生成式引擎优化）平台原型。前端为原生 HTML/CSS/JS 单页应用，后端为 Spring Boot + PostgreSQL。

## 目录结构

```
geodemo/
├── index.html / styles.css / *.js      前端（原生 SPA）
│   ├── api.js                          后端适配层（连不上后端时自动退回内置演示数据）
│   └── pages-*.js                      各业务页面
└── server/                             Spring Boot 后端
    ├── pom.xml
    └── src/main/java/com/geodemo/
        ├── domain/                     实体：品牌、监控问题、渠道、稿件、发布工单
        ├── repo/                       JPA 仓储
        ├── service/AgentService.java   Agent 对话（DeepSeek 可选，未配置时按数据库指标生成）
        ├── web/                        REST 接口
        └── config/SeedData.java        首次启动写入种子数据
```

## 技术栈

- 前端：原生 HTML / CSS / JavaScript，无构建步骤
- 后端：Java 21、Spring Boot 3.5.6、Spring Data JPA
- 数据库：PostgreSQL 18
- 大模型：DeepSeek（OpenAI 兼容接口），可选

## 启动步骤

### 1. 启动 PostgreSQL

本机安装在 `D:\develop\pgsql`，未注册 Windows 服务，需要手动启动：

```bat
"D:\develop\pgsql\bin\pg_ctl.exe" -D "D:\develop\pgsql\data" -l "D:\develop\pgsql\data\server.log" start
```

或双击仓库根目录的 `start-db.cmd`。

如需开机自启，请用管理员身份执行一次：

```bat
"D:\develop\pgsql\bin\pg_ctl.exe" register -N postgresql-x64-18 -D "D:\develop\pgsql\data" -S auto
```

### 2. 启动后端

```bat
cd server
mvn spring-boot:run
```

或双击 `start-server.cmd`。启动后访问 http://localhost:8080

后端会自动建表（`ddl-auto: update`），并在首次启动时写入种子数据（品牌 3 个、监控问题 7 条、渠道 7 个、稿件 4 篇）。

### 3. 配置大模型（可选）

不配置也能用：Agent 会用数据库指标按规则生成回答。配置后由 DeepSeek 真实回答：

```bat
set DEEPSEEK_API_KEY=你的密钥
mvn spring-boot:run
```

## 数据库

| 项 | 值 |
|----|----|
| 地址 | `jdbc:postgresql://127.0.0.1:5432/geodemo` |
| 用户 | `postgres` |
| 密码 | `postgres`（本地 trust 认证，密码不校验） |

手工建库：

```sql
CREATE DATABASE geodemo WITH ENCODING 'UTF8';
```

## 接口清单

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查，返回各表记录数 |
| GET | `/api/bootstrap` | 前端启动数据：品牌、渠道、稿件、问题集 |
| GET | `/api/brands` | 品牌列表 |
| GET | `/api/overview?brandId=1` | 总览指标、引擎得分、竞品对比（按数据库实时计算） |
| GET | `/api/questions?brandId=1` | 监控问题列表 |
| PUT | `/api/questions` | 保存监控问题集（整组替换） |
| GET | `/api/channels` | 渠道列表 |
| GET | `/api/articles?brandId=1` | 稿件列表 |
| POST | `/api/articles` | 新建稿件 |
| PUT | `/api/articles` | 保存稿件标题 / 正文 / 状态 |
| GET | `/api/orders` | 发布工单列表（含合计费用） |
| POST | `/api/orders` | 一键分发，按渠道逐单落库 |
| POST | `/api/agent/chat` | Agent 对话，返回 `{reply, source, latencyMs}` |

## 前后端对接方式

`api.js` 在页面加载后拉取 `/api/bootstrap`：

- 成功 → 覆盖内置演示数据，右上角显示「已连接后端 · PostgreSQL」
- 失败 → 保持内置演示数据，右上角显示「离线演示数据」，所有交互仍可用

已接后端的交互：

| 页面 | 行为 | 落库情况 |
|------|------|----------|
| 品牌总览 | 四个指标、引擎得分 | 由后端按问题集实时计算 |
| 中立监测 | 保存监控问题集 | 写入 `monitor_question` |
| 循证写作 | 生成稿件、提交审核 | 写入 / 更新 `article` |
| 精准发稿 | 确认一键分发 | 写入 `publish_order`，刷新后仍在 |
| GEO Agent | 发送任务 | 调用后端，配置密钥时走大模型 |

## 已知边界

- 未接入真实 AI 引擎采集（豆包、DeepSeek 等），监测数据为种子数据
- 未接入真实媒体发布渠道，工单状态不会真实流转
- 无登录鉴权，接口均为本地开发直连
- 向量检索（pgvector）尚未启用，知识库能力待后续迭代
