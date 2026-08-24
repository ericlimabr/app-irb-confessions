// Gera a página de prova editorial (self-contained) a partir de content/.
// Uso: npm run prova  → escreve prova-editorial.html na raiz do repo.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(REPO, 'prova-editorial.html');
const root = path.join(REPO, 'content');

const ORDER = ['psalms', 'hymns', 'heidelberg', 'belgic', 'dort'];
const collections = [];
for (const c of ORDER) {
  const meta = JSON.parse(fs.readFileSync(path.join(root, c, '_collection.json'), 'utf8'));
  const docs = [];
  for (const f of fs.readdirSync(path.join(root, c))) {
    if (f === '_collection.json' || !f.endsWith('.json')) continue;
    docs.push(JSON.parse(fs.readFileSync(path.join(root, c, f), 'utf8')));
  }
  docs.sort((a, b) => a.sortOrder - b.sortOrder);
  collections.push({ id: meta.id, title: meta.title, subtitle: meta.subtitle, kind: meta.kind, version: meta.version, docs });
}
const data = { generatedAt: '2026-08-24', collections };
const nDocs = collections.reduce((s, c) => s + c.docs.length, 0);
const nUnits = collections.reduce((s, c) => s + c.docs.reduce((t, d) => t + d.units.length, 0), 0);

const html = `<title>Prova Editorial</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{
  --paper:#F1EEE7; --surface:#FBFAF6; --ink:#221F1B; --muted:#5B554C; --faint:#8A8172;
  --hair:#DAD4C8; --hair-strong:#C7BFB0; --accent:#8A2B24; --accent-soft:#A8483F;
  --blue:#2E4257; --sel:#EDE7DA; --shadow:rgba(40,32,24,.10);
  --serif:'EB Garamond', Georgia, 'Times New Roman', serif;
  --sans:'Public Sans', system-ui, -apple-system, sans-serif;
  --mono:'IBM Plex Mono', ui-monospace, 'SFMono-Regular', monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#1A1815; --surface:#221F1B; --ink:#E9E4DA; --muted:#A69E90; --faint:#7E7768;
  --hair:#332E27; --hair-strong:#443D34; --accent:#D08279; --accent-soft:#C9736A;
  --blue:#8FB0C9; --sel:#2A251F; --shadow:rgba(0,0,0,.35);
}}
:root[data-theme="dark"]{
  --paper:#1A1815; --surface:#221F1B; --ink:#E9E4DA; --muted:#A69E90; --faint:#7E7768;
  --hair:#332E27; --hair-strong:#443D34; --accent:#D08279; --accent-soft:#C9736A;
  --blue:#8FB0C9; --sel:#2A251F; --shadow:rgba(0,0,0,.35);
}
*{box-sizing:border-box}
html,body{margin:0;height:100%}
body{background:var(--paper);color:var(--ink);font-family:var(--serif);
  font-size:18px;line-height:1.6;-webkit-font-smoothing:antialiased}
.app{display:grid;grid-template-columns:340px 1fr;grid-template-rows:auto 1fr;
  grid-template-areas:"head head" "side main";height:100vh}

/* ── header ── */
header{grid-area:head;display:flex;align-items:center;gap:18px;flex-wrap:wrap;
  padding:14px 22px;background:var(--surface);border-bottom:1px solid var(--hair);
  box-shadow:0 1px 0 var(--shadow)}
.brand{display:flex;flex-direction:column;line-height:1.15}
.brand .t{font-family:var(--sans);font-weight:700;font-size:15px;letter-spacing:.14em;
  text-transform:uppercase}
.brand .s{font-family:var(--sans);font-size:11.5px;color:var(--faint);letter-spacing:.03em}
.tabs{display:flex;gap:4px;flex-wrap:wrap}
.tab{font-family:var(--sans);font-size:12.5px;font-weight:600;letter-spacing:.03em;
  padding:6px 13px;border:1px solid var(--hair-strong);background:transparent;color:var(--muted);
  border-radius:999px;cursor:pointer;transition:.15s;white-space:nowrap}
.tab:hover{color:var(--ink);border-color:var(--accent-soft)}
.tab[aria-selected="true"]{background:var(--accent);color:#fff;border-color:var(--accent)}
.tab .n{opacity:.7;font-weight:500;margin-left:5px}
.spacer{flex:1}
.theme{font-family:var(--sans);font-size:12px;font-weight:600;color:var(--muted);
  background:transparent;border:1px solid var(--hair-strong);border-radius:999px;
  padding:6px 12px;cursor:pointer}
.theme:hover{color:var(--ink);border-color:var(--accent-soft)}

/* ── sidebar ── */
aside{grid-area:side;border-right:1px solid var(--hair);background:var(--surface);
  display:flex;flex-direction:column;min-height:0}
.search{padding:12px;border-bottom:1px solid var(--hair)}
.search input{width:100%;font-family:var(--sans);font-size:14px;color:var(--ink);
  background:var(--paper);border:1px solid var(--hair-strong);border-radius:8px;
  padding:9px 12px;outline:none}
.search input:focus{border-color:var(--accent-soft);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 15%,transparent)}
.list{overflow-y:auto;flex:1;padding:6px 0}
.item{display:flex;gap:10px;align-items:baseline;padding:7px 16px;cursor:pointer;
  border-left:3px solid transparent}
.item:hover{background:var(--sel)}
.item[aria-current="true"]{background:var(--sel);border-left-color:var(--accent)}
.item .num{font-family:var(--mono);font-size:11.5px;color:var(--accent);min-width:58px;
  font-variant-numeric:tabular-nums}
.item .ttl{font-size:15px;line-height:1.3;color:var(--ink)}
.item .var{font-family:var(--sans);font-size:10px;font-weight:700;letter-spacing:.06em;
  text-transform:uppercase;color:var(--blue);border:1px solid var(--hair-strong);
  border-radius:4px;padding:0 4px;margin-left:auto}
.grouphdr{font-family:var(--sans);font-size:10.5px;font-weight:700;letter-spacing:.12em;
  text-transform:uppercase;color:var(--faint);padding:14px 16px 5px}

/* ── reader ── */
main{grid-area:main;overflow-y:auto;min-height:0}
.doc{max-width:44rem;margin:0 auto;padding:48px 40px 120px}
.dochead{border-bottom:2px solid var(--accent);padding-bottom:18px;margin-bottom:30px}
.eyebrow{font-family:var(--sans);font-size:12px;font-weight:700;letter-spacing:.16em;
  text-transform:uppercase;color:var(--accent);display:flex;gap:10px;align-items:center}
.eyebrow .coll{color:var(--faint)}
.doctitle{font-size:34px;line-height:1.12;font-weight:600;margin:.32em 0 0;text-wrap:balance;
  letter-spacing:-.01em}
.docsub{font-style:italic;color:var(--muted);font-size:19px;margin-top:.35em}
.meta{font-family:var(--sans);font-size:12.5px;color:var(--faint);margin-top:14px;
  display:flex;gap:8px 18px;flex-wrap:wrap}
.meta b{color:var(--muted);font-weight:600}

.unit{margin:0 0 20px;display:grid;grid-template-columns:auto 1fr;gap:0 16px}
.unit.full{display:block}
.lbl{font-family:var(--mono);font-size:12px;font-weight:500;color:var(--accent);
  padding-top:.32em;white-space:nowrap;letter-spacing:.02em;user-select:none}
.body{white-space:pre-wrap;font-size:18.5px}
.uheading{font-family:var(--sans);font-size:12.5px;font-weight:700;letter-spacing:.04em;
  color:var(--muted);text-transform:uppercase;margin:0 0 4px}
.stanza .snum{font-family:var(--mono);font-size:12px;color:var(--accent-soft)}
.verse .body{font-size:19px;line-height:1.55}
sup{font-family:var(--mono);font-size:.62em;color:var(--blue);font-weight:500;
  vertical-align:.5em;padding:0 .12em;font-variant-numeric:tabular-nums}
.elis{color:var(--accent-soft);opacity:.75}
em{font-style:italic}
.refrain{background:var(--sel);border-left:3px solid var(--hair-strong);
  padding:12px 18px;border-radius:0 6px 6px 0;font-style:italic;color:var(--muted)}
.refrain .body{font-style:italic}
.amen{text-align:center;font-style:italic;color:var(--accent-soft);font-size:20px;
  margin:26px 0;letter-spacing:.02em}
.rejection .lbl{color:var(--accent)}
.section .body{font-size:18px}
.refs{grid-column:2;margin-top:8px;font-family:var(--mono);font-size:12px;line-height:1.7;
  color:var(--faint);border-top:1px dashed var(--hair-strong);padding-top:7px}
.refs .rk{color:var(--accent-soft);font-weight:500;margin-right:8px;text-transform:uppercase;
  letter-spacing:.08em;font-size:10.5px}
.refs .r{margin-right:2px}
.refs .r:not(:last-child)::after{content:' · ';color:var(--hair-strong)}

.empty{color:var(--faint);text-align:center;padding:80px 20px;font-style:italic}
.legend{max-width:44rem;margin:0 auto;padding:0 40px 60px;color:var(--faint);
  font-family:var(--sans);font-size:12px;line-height:1.9;border-top:1px solid var(--hair);
  padding-top:20px}
.legend code{font-family:var(--mono);color:var(--accent-soft);background:var(--sel);
  padding:1px 5px;border-radius:4px}
.mobile-toggle{display:none}

@media (max-width:860px){
  .app{grid-template-columns:1fr;grid-template-areas:"head" "main"}
  aside{position:fixed;top:0;left:0;bottom:0;width:min(88vw,340px);z-index:40;
    transform:translateX(-100%);transition:transform .22s;box-shadow:0 0 40px var(--shadow);
    grid-area:unset;padding-top:56px}
  body.nav-open aside{transform:translateX(0)}
  .scrim{display:none;position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:30}
  body.nav-open .scrim{display:block}
  .mobile-toggle{display:inline-flex;align-items:center;gap:7px;font-family:var(--sans);
    font-size:12.5px;font-weight:600;background:transparent;border:1px solid var(--hair-strong);
    color:var(--muted);border-radius:8px;padding:7px 11px;cursor:pointer}
  .doc{padding:32px 22px 100px}
  .doctitle{font-size:27px}
  .legend{padding:20px 22px 60px}
  .unit{grid-template-columns:1fr;gap:2px}
  .lbl{padding-top:0}
  .refs{grid-column:1}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>

<div class="app">
  <header>
    <button class="mobile-toggle" id="navbtn" aria-label="Abrir lista">☰ Documentos</button>
    <div class="brand"><span class="t">Prova Editorial</span><span class="s">App IRB · conteúdo gerado · confira contra o impresso</span></div>
    <div class="tabs" id="tabs" role="tablist"></div>
    <span class="spacer"></span>
    <button class="theme" id="themebtn">Tema</button>
  </header>
  <aside>
    <div class="search"><input id="search" type="search" placeholder="Filtrar por número ou título…" autocomplete="off"></div>
    <div class="list" id="list"></div>
  </aside>
  <main id="main"><div class="empty">Selecione um documento.</div></main>
  <div class="scrim" id="scrim"></div>
</div>

<script id="data" type="application/json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
<script>
const DATA = JSON.parse(document.getElementById('data').textContent);
const KIND_LABEL = {psalm:'Salmo',hymn:'Hino',catechism:'Domingo',confession:'Artigo',canons:'Capítulo'};
let cur = {coll:0, doc:0};

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function inline(s){
  let t = esc(s);
  t = t.replace(/\\\\_/g, '<span class="elis">\u203f</span>');      // elisão \\_ → ‿
  t = t.replace(/&lt;sup&gt;(.*?)&lt;\\/sup&gt;/g, '<sup>$1</sup>'); // versículo
  t = t.replace(/_([^_]+)_/g, '<em>$1</em>');                        // itálico
  return t;
}

function renderUnit(u){
  const role = u.attrs && u.attrs.role;
  const refs = u.attrs && u.attrs.refs;
  const heading = u.attrs && u.attrs.heading;
  if (role === 'amen') return '<div class="amen">'+inline(u.body)+'</div>';
  if (u.kind === 'refrain') return '<div class="unit full refrain"><div class="body">'+inline(u.body)+'</div></div>';
  if (u.kind === 'section') return '<div class="unit full section"><div class="body">'+inline(u.body)+'</div></div>';
  if (u.kind === 'heading') return '<p class="uheading">'+inline(u.body)+'</p>';

  const lbl = u.label ? '<div class="lbl">'+esc(u.label)+'</div>' : '<div class="lbl"></div>';
  let refsHtml = '';
  if (refs && refs.length){
    refsHtml = '<div class="refs"><span class="rk">ref</span>'+
      refs.map(r=>'<span class="r">'+esc(r)+'</span>').join('')+'</div>';
  }
  const head = heading ? '<p class="uheading">'+inline(heading)+'</p>' : '';
  return '<div class="unit '+u.kind+'">'+lbl+'<div><div>'+head+'<span class="body">'+inline(u.body)+'</span></div>'+refsHtml+'</div></div>';
}

function renderDoc(coll, doc){
  const kl = KIND_LABEL[coll.kind] || '';
  const meta = [];
  if (doc.attrs){
    if (doc.attrs.section) meta.push('<span><b>Seção</b> '+esc(doc.attrs.section)+'</span>');
    if (doc.attrs.bibleRef) meta.push('<span><b>Texto</b> '+esc(doc.attrs.bibleRef)+'</span>');
    if (doc.attrs.author) meta.push('<span><b>Autoria</b> '+esc(doc.attrs.author)+'</span>');
    if (doc.attrs.attribution) meta.push('<span><b>Atribuição</b> '+esc(doc.attrs.attribution)+'</span>');
    if (doc.attrs.role==='conclusion') meta.push('<span><b>Papel</b> conclusão dos Cânones</span>');
  }
  const vlabel = doc.variant==='gen'?'Genebrino':doc.variant==='har'?'Harmônico':'';
  const eyebrow = '<div class="eyebrow"><span>'+esc(doc.numberLabel||kl||doc.id)+'</span>'+
    (vlabel?'<span class="coll">· '+vlabel+'</span>':'')+
    '<span class="coll">· '+esc(coll.title)+'</span></div>';
  const title = doc.title ? '<h1 class="doctitle">'+inline(doc.title)+'</h1>' : '';
  const sub = doc.subtitle ? '<div class="docsub">'+inline(doc.subtitle)+'</div>' : '';
  const metaHtml = meta.length ? '<div class="meta">'+meta.join('')+'</div>' : '';
  const units = doc.units.map(renderUnit).join('');
  return '<div class="doc"><div class="dochead">'+eyebrow+title+sub+metaHtml+'</div>'+units+'</div>'+
    '<div class="legend">Renderização fiel ao JSON gerado. '+
    '<code>‿</code> = elisão de canto (fonte <code>\\\\_</code>) · '+
    '<sup>n</sup> = número de versículo · <em>itálico</em> = ênfase/citação da fonte · '+
    'rótulos e referências como no impresso. Documento <code>'+esc(doc.id)+'</code>.</div>';
}

function buildTabs(){
  const t = document.getElementById('tabs');
  t.innerHTML = DATA.collections.map((c,i)=>
    '<button class="tab" role="tab" data-i="'+i+'" aria-selected="'+(i===cur.coll)+'">'+
    esc(c.title)+'<span class="n">'+c.docs.length+'</span></button>').join('');
  t.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{cur={coll:+b.dataset.i,doc:0};document.getElementById('search').value='';render();});
}

function buildList(filter){
  const coll = DATA.collections[cur.coll];
  const list = document.getElementById('list');
  const q = (filter||'').trim().toLowerCase();
  let html='', lastSection=null;
  coll.docs.forEach((d,i)=>{
    const hay = ((d.numberLabel||'')+' '+(d.title||'')+' '+(d.attrs&&d.attrs.section||'')).toLowerCase();
    if (q && !hay.includes(q)) return;
    if (coll.kind==='hymn' && d.attrs && d.attrs.section && d.attrs.section!==lastSection){
      lastSection=d.attrs.section; html+='<div class="grouphdr">'+esc(d.attrs.section)+'</div>';
    }
    const num = esc((d.numberLabel||'').replace(/^(Salmo|Hino|Domingo|Art\\.|Capítulos?|Conclusão)\\s*/,'')||'—');
    const v = d.variant==='gen'?'Gen':d.variant==='har'?'Har':'';
    html+='<div class="item" data-i="'+i+'" aria-current="'+(i===cur.doc)+'">'+
      '<span class="num">'+num+'</span><span class="ttl">'+inline(d.title||d.numberLabel||d.id)+'</span>'+
      (v?'<span class="var">'+v+'</span>':'')+'</div>';
  });
  list.innerHTML = html || '<div class="empty">Nada encontrado.</div>';
  list.querySelectorAll('.item').forEach(el=>el.onclick=()=>{cur.doc=+el.dataset.i;render();document.body.classList.remove('nav-open');document.getElementById('main').scrollTop=0;});
}

function render(){
  const coll = DATA.collections[cur.coll];
  const doc = coll.docs[cur.doc];
  document.querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-selected', +b.dataset.i===cur.coll));
  buildList(document.getElementById('search').value);
  document.getElementById('main').innerHTML = doc ? renderDoc(coll, doc) : '<div class="empty">Selecione um documento.</div>';
}

document.getElementById('search').addEventListener('input', e=>buildList(e.target.value));
document.getElementById('navbtn').onclick=()=>document.body.classList.toggle('nav-open');
document.getElementById('scrim').onclick=()=>document.body.classList.remove('nav-open');
const themebtn=document.getElementById('themebtn');
function applyTheme(t){ if(t) document.documentElement.setAttribute('data-theme',t); }
try{ applyTheme(localStorage.getItem('irb-theme')); }catch(e){}
themebtn.onclick=()=>{
  const now=document.documentElement.getAttribute('data-theme');
  const mqDark=matchMedia('(prefers-color-scheme:dark)').matches;
  const next = now ? (now==='dark'?'light':'dark') : (mqDark?'light':'dark');
  applyTheme(next); try{localStorage.setItem('irb-theme',next);}catch(e){}
};
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT')return;
  const coll=DATA.collections[cur.coll];
  if(e.key==='j'||e.key==='ArrowDown'){if(cur.doc<coll.docs.length-1){cur.doc++;render();document.getElementById('main').scrollTop=0;}}
  if(e.key==='k'||e.key==='ArrowUp'){if(cur.doc>0){cur.doc--;render();document.getElementById('main').scrollTop=0;}}
});
buildTabs(); render();
</script>`;

fs.writeFileSync(OUT, html);
console.log('escrito:', OUT, (fs.statSync(OUT).size/1024/1024).toFixed(2), 'MB');
console.log('docs:', nDocs, '| units:', nUnits);
