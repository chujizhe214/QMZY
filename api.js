/* 后端适配层：连上 Spring Boot 时用真实接口数据，未连接时自动退回内置演示数据。 */
const API = { online: false, brandId: 1, orders: null, lastOverview: null };

async function apiCall(path, options = {}) {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function apiBrandId() {
  return (state.brand && state.brand.id) ? state.brand.id : API.brandId;
}

function apiBadge(text, ok) {
  const el = document.querySelector('.freshness');
  if (!el) return;
  el.innerHTML = `<i style="background:${ok ? '#0f9f8f' : '#c4c8d2'}"></i> ${text}`;
}

/** 启动时拉取品牌、渠道、稿件与问题集，覆盖内置演示数组。 */
async function apiBootstrap() {
  try {
    const data = await apiCall('/api/bootstrap');
    if (!data.brands || !data.brands.length) return;

    brands.length = 0;
    data.brands.forEach(b => brands.push(b));

    channels.length = 0;
    (data.channels || []).forEach(c => channels.push({
      id: c.id,
      name: c.name,
      type: c.type,
      citations: c.citations,
      rate: c.publishRate,
      price: c.price,
      recommended: c.recommended,
      auth: '已认证',
      engines: String(c.engines || '').split(',').filter(Boolean)
    }));

    documents.length = 0;
    (data.articles || []).forEach(a => documents.push({
      id: a.id,
      title: a.title,
      time: a.updatedAt,
      status: a.status,
      body: a.content || '<p>暂无正文</p>'
    }));

    state.brand = brands[0];
    state.selectedChannels.clear();
    API.online = true;
    API.brandId = brands[0].id;

    render();
    apiBadge('已连接后端 · PostgreSQL', true);
  } catch (e) {
    console.info('[GEO] 未连接后端，使用内置演示数据。启动后端后刷新即可切换。', e.message);
    apiBadge('离线演示数据', false);
  }
}

/** 总览页指标改为后端实时计算结果。 */
async function apiPatchOverview() {
  if (!API.online) return;
  try {
    const data = await apiCall(`/api/overview?brandId=${apiBrandId()}`);
    API.lastOverview = data;
    (data.metrics || []).forEach(m => {
      const card = document.querySelector(`[data-metric="${m.key}"]`);
      if (!card) return;
      const value = card.querySelector('.metric-value');
      if (value) value.innerHTML = `${m.value}<small>${m.unit}</small>`;
      const delta = card.querySelector('.metric-delta');
      if (delta) {
        const positive = m.delta >= 0;
        delta.className = `metric-delta ${positive ? 'positive' : 'negative'}`;
        delta.innerHTML = `${icon(positive ? 'up' : 'down', 11)}${positive ? '+' : ''}${m.delta}%<span>较上期</span>`;
      }
    });
    (data.engines || []).forEach((engine, i) => {
      const row = document.querySelectorAll('.engine-row')[i];
      if (!row) return;
      const score = row.querySelector('.engine-score');
      if (score) score.textContent = engine.score;
      const bar = row.querySelector('.engine-bar i');
      if (bar) bar.style.width = `${engine.score}%`;
    });
  } catch (e) {
    console.info('[GEO] 总览指标拉取失败', e.message);
  }
}

/** 发布工单：读取数据库中的真实工单。 */
async function apiLoadOrders() {
  try {
    const data = await apiCall('/api/orders');
    API.orders = data.orders || [];
    return data;
  } catch (e) {
    console.info('[GEO] 工单拉取失败', e.message);
    return null;
  }
}

async function apiPublish(articleTitle, channelIds) {
  try {
    const data = await apiCall('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ articleTitle, channelIds })
    });
    await apiLoadOrders();
    render();
    toast(`后端已落库 ${data.created} 个工单，合计 ¥${money(data.totalCost)}`);
  } catch (e) {
    toast('工单提交失败：后端未连接', 'error');
  }
}

async function apiSaveQuestions(texts) {
  try {
    const data = await apiCall('/api/questions', {
      method: 'PUT',
      body: JSON.stringify({ brandId: apiBrandId(), texts })
    });
    toast(`监控问题已写入数据库，共 ${data.saved} 条`);
    await apiPatchOverview();
  } catch (e) {
    toast('监控配置保存失败：后端未连接', 'error');
  }
}

async function apiUpdateArticle(article) {
  if (!article || !article.id) return;
  try {
    await apiCall('/api/articles', {
      method: 'PUT',
      body: JSON.stringify({ id: article.id, title: article.title, content: article.body, status: article.status })
    });
  } catch (e) {
    console.info('[GEO] 稿件保存失败', e.message);
  }
}

async function apiCreateArticle(title) {
  try {
    const created = await apiCall('/api/articles', {
      method: 'POST',
      body: JSON.stringify({ brandId: apiBrandId(), title })
    });
    documents.unshift({
      id: created.id,
      title: created.title,
      time: created.updatedAt,
      status: created.status,
      body: created.content || '<p>稿件已由后端创建。</p>'
    });
    state.selectedDoc = 0;
    state.writingTab = '稿件工作台';
    render();
    toast('稿件已在后端创建');
    return true;
  } catch (e) {
    return false;
  }
}

/** Agent 对话走后端：配置了模型密钥时由大模型回答，否则由后端按数据库指标生成。 */
async function apiAgentChat(message) {
  try {
    const data = await apiCall('/api/agent/chat', {
      method: 'POST',
      body: JSON.stringify({ brandId: apiBrandId(), message })
    });
    return data;
  } catch (e) {
    return null;
  }
}

function apiTextToHtml(text) {
  return String(text || '')
    .split(/\n+/)
    .filter(line => line.trim())
    .map(line => `<p>${esc(line)}</p>`)
    .join('');
}

/* 在原有 render 之后附加后端数据补丁 */
const __originalRender = render;
render = function () {
  __originalRender();
  if (!API.online) return;
  if (state.route === 'overview') apiPatchOverview();
  if (state.route === 'distribution' && state.distributionTab === '发布工单' && !API.orders) {
    apiLoadOrders().then(list => { if (list) render(); });
  }
};

apiBootstrap();
