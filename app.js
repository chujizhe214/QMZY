const pageRenderers={overview:renderOverview,monitoring:renderMonitoring,insights:renderInsights,writing:renderWriting,distribution:renderDistribution,attribution:renderAttribution,agent:renderAgent,commerce:renderCommerce,diagnosis:renderDiagnosis,workspaces:renderWorkspaces};
function renderNav(){document.getElementById('main-nav').innerHTML=navSections.map(s=>`<div class="nav-section"><div class="nav-label">${s.label}</div>${s.items.map(i=>`<button class="nav-item ${state.route===i[0]?'active':''}" data-route="${i[0]}">${icon(i[1])}<span class="nav-text">${i[2]}</span>${i[3]==='dot'?'<span class="agent-dot"></span>':i[3]?`<span class="nav-badge">${i[3]}</span>`:''}</button>`).join('')}</div>`).join('')}
function syncEditor(){if(state.route!=='writing'||state.writingTab!=='稿件工作台')return;const title=document.getElementById('editor-title'),content=document.getElementById('editor-content');if(title&&content){documents[state.selectedDoc].title=title.value;documents[state.selectedDoc].body=content.innerHTML}}
function render(){const renderer=pageRenderers[state.route]||renderOverview;document.getElementById('view').innerHTML=renderer();document.getElementById('breadcrumb-parent').textContent=routeMeta[state.route][0];document.getElementById('breadcrumb-current').textContent=routeMeta[state.route][1];document.getElementById('sidebar-brand').textContent=state.brand.name;const avatar=document.getElementById('brand-avatar');avatar.textContent=state.brand.avatar;avatar.style.background=state.brand.color;avatar.style.color=state.brand.ink;renderNav();hydrateIcons();if(state.route==='agent'){const chat=document.getElementById('chat-scroll');if(chat)chat.scrollTop=chat.scrollHeight}}
function navigate(route){if(!pageRenderers[route])return;syncEditor();state.route=route;closeModal();closeSidebar();render();window.scrollTo({top:0,behavior:'smooth'});history.replaceState(null,'',`#${route}`)}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-mask').classList.remove('show')}
function sendAgent(prompt){prompt=(prompt||document.getElementById('agent-input')?.value||'').trim();if(!prompt){toast('请输入要执行的任务','error');return}state.chat=state.chat||[];state.chat.push({role:'user',text:prompt});state.agentExecuted=false;render();setTimeout(()=>{state.chat.push({role:'agent',html:agentDefaultResponse(prompt)});if(state.route==='agent')render()},500)}
function filterRows(input){const q=input.value.trim().toLowerCase(),container=input.closest('.card')||document;container.querySelectorAll('[data-search-row]').forEach(row=>{row.style.display=row.dataset.searchRow.toLowerCase().includes(q)?'':'none'})}
function filterChannels(){const q=document.querySelector('[data-action="row-search"]')?.value.trim().toLowerCase()||'';document.querySelectorAll('[data-channel-type]').forEach(row=>{const matchesQ=row.dataset.searchRow.toLowerCase().includes(q),matchesT=state.channelType==='全部类型'||row.dataset.channelType===state.channelType;row.style.display=matchesQ&&matchesT?'':'none'})}

document.addEventListener('click',event=>{
  const routeEl=event.target.closest('[data-route]');
  if(routeEl){event.preventDefault();navigate(routeEl.dataset.route);return}
  const el=event.target.closest('[data-action]');
  if(!el)return;
  const action=el.dataset.action;
  if(action==='backdrop'){if(event.target===el)closeModal();return}
  event.preventDefault();
  switch(action){
    case 'search':showSearch();break;
    case 'notifications':showNotifications();break;
    case 'close-modal':closeModal();break;
    case 'select-brand':{const brand=brands.find(b=>b.name===el.dataset.name);if(brand){state.brand=brand;closeModal();render();toast(`已切换至 ${brand.name} 工作台`)}break}
    case 'select-brand-menu':showBrandSwitcher();break;
    case 'export-report':toast('报告导出任务已创建，演示文件将在稍后就绪');break;
    case 'export-csv':downloadCSV();break;
    case 'terminal':state.terminal=el.dataset.value;render();break;
    case 'monitor-tab':state.monitorTab=el.dataset.tab;render();break;
    case 'monitor-config':showMonitorConfig();break;
    case 'save-monitor':closeModal();toast('监控配置已保存，首轮中立监测已启动');break;
    case 'snapshot':showSnapshot(Number(el.dataset.index||0));break;
    case 'source-detail':showSourceDetail(Number(el.dataset.index||0));break;
    case 'risk-detail':openModal('负面内容传播路径','定位原始网页与关联传播节点',`<div class="attribution-flow" style="margin:20px 0"><div class="flow-node"><strong>1</strong><small>原始网页</small></div><span class="flow-arrow">${icon('arrow')}</span><div class="flow-node"><strong>3</strong><small>转载页面</small></div><span class="flow-arrow">${icon('arrow')}</span><div class="flow-node"><strong>4</strong><small>AI 负面语义</small></div></div><div class="risk-card"><strong>原始内容：个别用户使用后的泛红反馈</strong><p>内容包含个体体验，缺少适用肤质与使用方式背景。建议核查产品说明，并补充适用人群和使用边界。</p></div>`,'<button class="button" data-action="export-report">导出路径</button><button class="button primary" data-action="close-modal">完成</button>');break;
    case 'competitor-settings':simpleModal('管理竞品','可添加品牌名称、别名与官网。实体归一后将在同一监控问题集中进行中立对比。');break;
    case 'insight-action':{const i=Number(el.dataset.index);if(i===0)showSnapshot(0);else if(i===1){state.distributionTab='渠道资源';navigate('distribution')}else showNewWriting();break}
    case 'add-topic':state.addedTopics.add(Number(el.dataset.index));render();toast('潜力话题已加入监控问题集');break;
    case 'refresh-topics':toast('已根据最新行业提问刷新机会评分');break;
    case 'writing-tab':syncEditor();state.writingTab=el.dataset.tab;render();break;
    case 'select-doc':syncEditor();state.selectedDoc=Number(el.dataset.index);state.verified=false;render();break;
    case 'new-writing':showNewWriting();break;
    case 'generate-writing':{const title=document.getElementById('new-writing-title')?.value.trim()||'未命名循证稿件';documents.unshift({title,time:'刚刚',status:'草稿',body:'<p>根据当前监测数据，品牌在这一问题上的内容覆盖仍有提升空间。以下内容仅使用品牌资料库与授权来源生成，关键事实均已标注出处。<span class="citation" data-action="citation">1</span></p><blockquote>结论前置：先回答用户最关心的问题，再提供有来源、有边界的解释。</blockquote><h2>一、核心结论</h2><p>结合实际使用场景，建议从明确需求、理解产品信息和关注个体差异三个方面进行判断。</p><h2>二、事实依据与适用边界</h2><p>品牌资料与授权内容提供了基础事实。对于个体体验与专业问题，应保留必要的条件说明，避免绝对化表达。<span class="citation" data-action="citation">2</span></p><h2>常见问题</h2><p><strong>Q：如何选择适合自己的方案？</strong><br>建议先明确使用场景，再核对产品说明与自身情况；如有持续不适，应咨询专业人士。</p>'});state.selectedDoc=0;state.writingTab='稿件工作台';state.verified=false;closeModal();state.route='writing';render();toast('循证初稿已生成，12 个事实点已关联来源');break}
    case 'format':{const value=el.dataset.value;document.execCommand(value,false,value==='formatBlock'?`<${el.dataset.tag}>`:null);document.getElementById('editor-content')?.focus();break}
    case 'ai-append':{const content=document.getElementById('editor-content');if(content){content.insertAdjacentHTML('beforeend','<h2>三、如何观察修护进展？</h2><p>可以通过紧绷感、干燥脱屑和泛红频率等日常感受记录状态变化，但不建议以单一表现作为判断依据。保持护理方式稳定，并给皮肤充分的适应时间。<span class="citation" data-action="citation">2</span></p>');content.scrollTop=content.scrollHeight;toast('Agent 已基于授权资料续写一段内容')}break}
    case 'citation':openModal('授权事实来源','每个关键事实均可追溯至授权资料',`<div class="evidence-card"><strong>[1] 澄光屏障修护精华产品手册 V3.2</strong><p>产品适用肤质、成分信息与使用方式，品牌资料库已授权。</p><small>更新于 2026-10-28 · 来源有效</small></div><div class="evidence-card"><strong>[2] 皮肤屏障护理科普资料</strong><p>皮肤屏障脂质、温和护理与个体差异的基础说明。</p><small>更新于 2026-09-16 · 来源有效</small></div><div class="evidence-card"><strong>[3] 产品温和性测试摘要</strong><p>测试样本、统计口径与结论适用边界。</p><small>更新于 2026-08-30 · 来源有效</small></div>`);break;
    case 'verify':syncEditor();state.verified=true;render();toast('核验完成：事实、禁用词与来源时效均通过');break;
    case 'submit-review':syncEditor();documents[state.selectedDoc].status='待审核';toast('稿件已提交审核，审核通过后可进入发稿流程');render();break;
    case 'use-template':state.writingTab='稿件工作台';render();toast('模板已应用到当前稿件');break;
    case 'asset-detail':simpleModal(el.dataset.name,'此处可维护资料条目、授权范围、更新时间与使用权限。当前为前端原型演示。');break;
    case 'distribution-tab':state.distributionTab=el.dataset.tab;render();break;
    case 'smart-plan':state.selectedChannels=new Set(channels.filter(c=>c.recommended).map(c=>c.id));state.distributionTab='渠道资源';render();toast('已按引擎信源偏好选择 4 个高采信渠道');break;
    case 'clear-cart':state.selectedChannels.clear();render();break;
    case 'remove-channel':state.selectedChannels.delete(Number(el.dataset.id));render();break;
    case 'publish':showPublishConfirm();break;
    case 'confirm-publish':state.selectedChannels.clear();state.distributionTab='发布工单';closeModal();render();toast('发布工单已创建，状态将逐单回传（原型模拟）');break;
    case 'channel-detail':{const c=channels[Number(el.dataset.id)];openModal(`${c.name} · 渠道表现`,'近 30 天 AI 引用与发布数据',`<div class="grid grid-3"><div class="metric-card" style="background:var(--surface-soft)"><small class="muted">AI 引用</small><div class="metric-value" style="margin-top:8px">${c.citations}<small>次</small></div></div><div class="metric-card" style="background:var(--surface-soft)"><small class="muted">出稿率</small><div class="metric-value" style="margin-top:8px">${c.rate}</div></div><div class="metric-card" style="background:var(--surface-soft)"><small class="muted">单篇价格</small><div class="metric-value" style="margin-top:8px">¥${c.price}</div></div></div><div class="evidence-card"><strong>推荐理由</strong><p>该渠道在 ${c.engines.join('、')} 的相关问题答案中表现稳定，适合承接专业解释与选购决策类内容。</p></div>`,'<button class="button" data-action="close-modal">关闭</button>');break}
    case 'order-detail':simpleModal('发布工单详情','工单包含审核、发布、收录链接与费用状态。每一步均有时间戳，失败订单全额退款。');break;
    case 'creator-contact':toast(`已生成与「${el.dataset.name}」的合作意向单`);break;
    case 'attribution-detail':showAttributionDetail(Number(el.dataset.index||0));break;
    case 'import-content':simpleModal('导入自有文章','支持批量导入官网与自有文章链接，导入后将自动追踪 AI 收录率与引用次数。');break;
    case 'agent-send':sendAgent();break;
    case 'agent-prompt':sendAgent(el.dataset.prompt);break;
    case 'execute-task':state.agentExecuted=true;render();toast('优化任务已完成：已生成 2 篇循证稿件与渠道计划');break;
    case 'agent-attachment':toast('可添加品牌资料或参考文档（原型演示）');break;
    case 'agent-data':{const input=document.getElementById('agent-input');if(input){input.value='基于近 30 天监测数据，';input.focus()}break}
    case 'commerce-settings':simpleModal('配置商品卡监控','可维护商品、店铺、竞品和监控问题，分引擎与终端独立统计出卡表现。');break;
    case 'product-detail':simpleModal('商品卡位格局','可查看该商品在不同 AI 引擎、终端和监控问题下的卡位、同榜竞品与原始商品卡快照。');break;
    case 'start-diagnosis':startDiagnosis();break;
    case 'subscribe-monitor':closeModal();navigate('monitoring');toast('已创建持续监测配置，请确认监控问题');break;
    case 'add-workspace':simpleModal('添加品牌工作台','填写品牌、行业与竞品信息即可创建独立数据空间，并与当前账号共享积分钱包。');break;
    case 'enter-workspace':{const b=brands.find(x=>x.name===el.dataset.name);if(b){state.brand=b;navigate('overview');toast(`已进入 ${b.name} 工作台`)}break}
    case 'batch-report':toast('3 个品牌的交付报告已进入批量生成队列');break;
    case 'wallet-detail':simpleModal('积分消耗明细','中立监测、单次诊断、写稿与渠道任务按实际使用逐项扣减，支持按品牌与日期筛选。');break;
    case 'permission-settings':simpleModal('成员与权限','支持系统管理员、品牌运营、内容编辑、管理层与代理商角色，品牌级数据隔离已启用。');break;
    case 'read-all':closeModal();document.querySelector('.notification-button b')?.remove();toast('所有通知已标为已读');break;
    case 'go-orders':state.distributionTab='发布工单';navigate('distribution');break;
    case 'go-latest-doc':state.selectedDoc=0;state.writingTab='稿件工作台';navigate('writing');break;
    case 'help':simpleModal('使用帮助','从“配置监控”开始，依次体验中立监测、洞察分析、循证写作、精准发稿与效果归因。按 Ctrl / ⌘ + K 可快速搜索功能。');break;
    case 'profile':simpleModal('账号与角色','林晓 · 品牌运营管理员。当前账号可管理监测、内容与发稿任务，并查看效果归因报告。');break;
    case 'upgrade':simpleModal('企业版','企业版提供高阶分析、API 对接、多品牌管理、私有化部署与 OEM 定制能力。');break;
  }
});
document.addEventListener('change',event=>{
  const el=event.target;
  if(el.dataset.change==='date'){state.date=el.value;render();toast(`统计周期已切换为${el.value}`)}
  if(el.dataset.change==='channel'){const id=Number(el.dataset.id);el.checked?state.selectedChannels.add(id):state.selectedChannels.delete(id);document.getElementById('cart-container').innerHTML=cartTemplate()}
  if(el.dataset.change==='channel-type'){state.channelType=el.value;filterChannels()}
});
document.addEventListener('input',event=>{
  const el=event.target;
  if(el.dataset.action==='row-search'){if(el.closest('.channel-table'))filterChannels();else filterRows(el)}
  if(el.dataset.action==='global-search'){const q=el.value.trim().toLowerCase();document.querySelectorAll('#command-results [data-search-row]').forEach(row=>row.style.display=row.dataset.searchRow.toLowerCase().includes(q)?'':'none')}
});
document.addEventListener('keydown',event=>{
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();showSearch()}
  if(event.key==='Escape'){closeModal();closeSidebar()}
  if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)&&event.target.id==='agent-input'){event.preventDefault();sendAgent()}
});
document.getElementById('workspace-switch').addEventListener('click',showBrandSwitcher);
document.getElementById('workspace-switch').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showBrandSwitcher()}});
document.getElementById('mobile-menu').addEventListener('click',()=>{document.getElementById('sidebar').classList.add('open');document.getElementById('sidebar-mask').classList.add('show')});
document.getElementById('sidebar-mask').addEventListener('click',closeSidebar);
const initialRoute=location.hash.slice(1);if(pageRenderers[initialRoute])state.route=initialRoute;
render();
