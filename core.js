/* 透镜 GEO · 纯前端交互原型。所有数据均为演示数据。 */
const iconPaths = {
  dashboard:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  radar:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="M12 3v2M21 12h-2M12 21v-2M3 12h2"/>',
  insight:'<path d="M9 18h6M10 22h4"/><path d="M8.4 14.5A6 6 0 1 1 15.6 14.5C14.6 15.2 14 16 14 17h-4c0-1-.6-1.8-1.6-2.5Z"/><path d="M12 5v3"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/><path d="m15 5 3 3"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  attribution:'<path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/><circle cx="7" cy="16" r="1"/><circle cx="11" cy="11" r="1"/><circle cx="15" cy="14" r="1"/><circle cx="20" cy="7" r="1"/>',
  agent:'<rect x="4" y="6" width="16" height="14" rx="4"/><path d="M12 2v4M8 12h.01M16 12h.01M8 16h8"/><path d="M2 11v5M22 11v5"/>',
  cart:'<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6"/>',
  scan:'<path d="M3 7V4a1 1 0 0 1 1-1h3M17 3h3a1 1 0 0 1 1 1v3M21 17v3a1 1 0 0 1-1 1h-3M7 21H4a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="12" r="4"/>',
  layers:'<path d="m12 2 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 3.7 2.4c-.8.4-1.2.9-1.2 1.8M12 17h.01"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  chevrons:'<path d="m8 9 4-4 4 4M16 15l-4 4-4-4"/>',
  chevron:'<path d="m9 18 6-6-6-6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  up:'<path d="m18 15-6-6-6 6"/>',
  trend:'<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/>',
  trophy:'<path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0Z"/><path d="M7 6H3v2a4 4 0 0 0 4 4M17 6h4v2a4 4 0 0 1-4 4"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  download:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
  filter:'<path d="M4 5h16M7 12h10M10 19h4"/>',
  alert:'<path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  close:'<path d="M18 6 6 18M6 6l12 12"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5Z"/><path d="M4 5.5v14M8 7h8M8 11h6"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  sparkles:'<path d="m12 3-1.4 3.6L7 8l3.6 1.4L12 13l1.4-3.6L17 8l-3.6-1.4ZM5 15l-.9 2.1L2 18l2.1.9L5 21l.9-2.1L8 18l-2.1-.9ZM19 14l-.9 2.1-2.1.9 2.1.9L19 20l.9-2.1L22 17l-2.1-.9Z"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  refresh:'<path d="M20 7h-6V1M4 17h6v6"/><path d="M5.5 9a8 8 0 0 1 13.3-3L20 7M4 17l1.2 1a8 8 0 0 0 13.3-3"/>',
  play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  wallet:'<path d="M20 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v12H5a3 3 0 0 1-3-3V6"/><path d="M16 13h4"/>',
  external:'<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  paperclip:'<path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.6-9.6a4 4 0 0 1 5.7 5.7l-9.6 9.6a2 2 0 0 1-2.8-2.8l8.9-8.9"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'
};
function icon(name, size=18){return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]||iconPaths.dashboard}</svg>`}
function hydrateIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon)})}
const navSections=[
  {label:'工作台',items:[['overview','dashboard','品牌总览']]},
  {label:'监测与洞察',items:[['monitoring','radar','中立监测'],['insights','insight','洞察分析','3']]},
  {label:'内容与增长',items:[['writing','edit','循证写作'],['distribution','send','精准发稿'],['attribution','attribution','效果归因']]},
  {label:'智能工具',items:[['agent','agent','GEO Agent','dot'],['commerce','cart','电商商品卡']]},
  {label:'其他',items:[['diagnosis','scan','单次诊断'],['workspaces','layers','多品牌工作台']]}
];
const routeMeta={overview:['工作台','品牌总览'],monitoring:['监测与洞察','中立监测'],insights:['监测与洞察','洞察分析'],writing:['内容与增长','循证写作'],distribution:['内容与增长','精准发稿'],attribution:['内容与增长','效果归因'],agent:['智能工具','GEO Agent'],commerce:['智能工具','电商商品卡'],diagnosis:['其他','单次诊断'],workspaces:['其他','多品牌工作台']};
const brands=[{name:'澄光生物',industry:'美妆个护',avatar:'澄',color:'#e5e9ff',ink:'#5058b9'},{name:'星野科技',industry:'智能家居',avatar:'星',color:'#e1f3ed',ink:'#287a66'},{name:'沐岚生活',industry:'母婴生活',avatar:'沐',color:'#fff0df',ink:'#b87532'}];
const state={route:'overview',brand:brands[0],date:'近 30 天',terminal:'全部终端',monitorTab:'排名监测',writingTab:'稿件工作台',distributionTab:'渠道资源',selectedChannels:new Set(),channelType:'全部类型',addedTopics:new Set(),agentExecuted:false,verified:false,selectedDoc:0,diagnosisDone:false};
const engineColors={豆包:'#3478f6',DeepSeek:'#635bff',腾讯元宝:'#0f9f8f',通义千问:'#ed8b32',文心一言:'#3478f6'};
let chartSequence=0;
function esc(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function money(n){return Number(n).toLocaleString('zh-CN')}
function sparkline(values,color='#635bff'){
  const w=76,h=34,min=Math.min(...values),max=Math.max(...values),range=max-min||1;
  const pts=values.map((v,i)=>`${i*w/(values.length-1)},${h-3-(v-min)/range*(h-8)}`).join(' ');
  return `<svg class="sparkline" viewBox="0 0 ${w} ${h}"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${w}" cy="${h-3-(values.at(-1)-min)/range*(h-8)}" r="2.5" fill="${color}"/></svg>`;
}
function lineChart(series,labels=['10/19','10/23','10/27','10/31','11/04','11/08','11/12','11/17'],max=100){
  const W=720,H=250,L=38,R=14,T=14,B=30,pw=W-L-R,ph=H-T-B,id=`chart-${++chartSequence}`;
  let out=`<svg class="line-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="趋势图"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${series[0].color}" stop-opacity=".18"/><stop offset="1" stop-color="${series[0].color}" stop-opacity="0"/></linearGradient></defs>`;
  for(let i=0;i<=4;i++){const y=T+ph*i/4,v=Math.round(max-(max*i/4));out+=`<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="#eceef3"/><text x="${L-9}" y="${y+3}" text-anchor="end" font-size="9" fill="#9ba2b1">${v}</text>`}
  labels.forEach((l,i)=>{const x=L+pw*i/(labels.length-1);out+=`<text x="${x}" y="${H-8}" text-anchor="middle" font-size="9" fill="#9ba2b1">${l}</text>`});
  series.forEach((s,si)=>{const pts=s.data.map((v,i)=>[L+pw*i/(s.data.length-1),T+ph-(v/max)*ph]);const path=pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');if(si===0)out+=`<path d="${path} L${pts.at(-1)[0]},${T+ph} L${pts[0][0]},${T+ph}Z" fill="url(#${id})"/>`;out+=`<path d="${path}" fill="none" stroke="${s.color}" stroke-width="${si===0?2.5:1.8}" stroke-linecap="round" stroke-linejoin="round"/>`;pts.forEach((p,i)=>{if(i===pts.length-1||si===0&&i%2===0)out+=`<circle cx="${p[0]}" cy="${p[1]}" r="${i===pts.length-1?3.5:2.5}" fill="#fff" stroke="${s.color}" stroke-width="2"/>`})});
  return out+'</svg>';
}
function metricCard(label,value,unit,delta,iconName,tone,spark,key){return `<article class="card metric-card"${key?` data-metric="${key}"`:''}><div class="metric-top"><span>${label}</span><span class="metric-icon ${tone}">${icon(iconName)}</span></div><div class="metric-value-row"><div><div class="metric-value">${value}<small>${unit}</small></div><div class="metric-delta ${delta.startsWith('+')?'positive':delta.startsWith('-')?'negative':''}">${delta.startsWith('+')?icon('up',11):delta.startsWith('-')?icon('down',11):''}${delta}<span>较上期</span></div></div>${sparkline(spark,tone==='teal'?'#0f9f8f':tone==='orange'?'#ed8b32':tone==='blue'?'#3478f6':'#635bff')}</div></article>`}
function pageHeading(title,desc,actions=''){return `<div class="page-heading"><div><h1>${title}</h1><p>${desc}</p></div><div class="page-actions">${actions}</div></div>`}
function dateSelect(){return `<select class="select date-button" data-change="date" aria-label="统计周期"><option ${state.date==='近 7 天'?'selected':''}>近 7 天</option><option ${state.date==='近 30 天'?'selected':''}>近 30 天</option><option ${state.date==='近 90 天'?'selected':''}>近 90 天</option></select>`}
function engineLogo(name){const cls={'豆包':'doubao','DeepSeek':'deepseek','腾讯元宝':'yuanbao','通义千问':'qwen','文心一言':'wenxin'}[name]||'deepseek';return `<span class="engine-logo ${cls}">${name==='DeepSeek'?'DS':name.slice(0,1)}</span>`}
function engineStack(names){return `<div class="avatar-stack">${names.map(engineLogo).join('')}</div>`}
function tabs(items,active,action){return `<div class="tabs">${items.map(x=>`<button class="tab ${x===active?'active':''}" data-action="${action}" data-tab="${x}">${x}${x==='发布工单'?'<span class="count">12</span>':''}</button>`).join('')}</div>`}
function toast(message,type='success'){const stack=document.getElementById('toast-stack'),el=document.createElement('div');el.className=`toast ${type}`;el.innerHTML=`<span>${icon(type==='error'?'alert':'check',16)}</span><div>${message}</div>`;stack.appendChild(el);setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(8px)';setTimeout(()=>el.remove(),200)},3000)}
function openModal(title,subtitle,body,footer='',wide=false){document.getElementById('modal-root').innerHTML=`<div class="modal-backdrop" data-action="backdrop"><section class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-header"><div><h2>${title}</h2>${subtitle?`<p>${subtitle}</p>`:''}</div><button class="modal-close" data-action="close-modal" aria-label="关闭">${icon('close',15)}</button></div><div class="modal-body">${body}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}</section></div>`;setTimeout(()=>document.querySelector('.modal input,.modal textarea,.modal button')?.focus(),30)}
function closeModal(){document.getElementById('modal-root').innerHTML=''}
function downloadCSV(){const rows=[['信源平台','渠道类型','引用次数','变化'],['知乎','问答社区',86,'+12'],['搜狐网','综合门户',73,'+8'],['微信公众号','自媒体',61,'+5'],['什么值得买','垂直媒体',44,'+16']];const csv='\ufeff'+rows.map(r=>r.join(',')).join('\n'),blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='GEO引用源演示数据.csv';a.click();URL.revokeObjectURL(url);toast('引用源数据已导出（CSV）')}
