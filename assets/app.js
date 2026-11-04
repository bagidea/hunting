// Panel gallery tabs.
const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
const panelImg = document.getElementById('panel-img');
const panelText = document.getElementById('panel-text');

function selectTab(tab) {
  tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
  panelImg.src = `assets/img/${tab.dataset.shot}.png`;
  panelImg.alt = `แผงควบคุม Hunting หน้า${tab.textContent}`;
  panelText.textContent = tab.dataset.text;
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    next.focus();
    selectTab(next);
  });
});

// Zone chart / normal chart comparison.
const chartImg = document.getElementById('chart-img');
const chartButtons = [...document.querySelectorAll('.view-switch button')];
chartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    chartButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    chartImg.src = `assets/img/${button.dataset.chart}.png`;
    chartImg.alt = button.dataset.chart === 'zones-chart'
      ? 'ตัวอย่างกราฟ EURUSD H1 ที่แสดงแท่งเทียนสีตามโซนและแถบ EMA'
      : 'ตัวอย่างกราฟ EURUSD H1 แบบปกติของ MetaTrader 5';
  });
});

// Downloads come from versions.json, so a new release only adds an entry there.
const REPO = 'https://github.com/bagidea/hunting/releases/download';
const box = document.getElementById('versions');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderVersion(v, isLatest) {
  const card = el('article', 'version');
  const info = el('div');
  const title = el('h3', '', `v${v.version}`);
  if (isLatest) title.append(el('span', 'tag latest', 'ล่าสุด'));
  if (v.channel === 'beta') title.append(el('span', 'tag', 'Beta'));
  info.append(title, el('p', 'meta', `${v.date} · ${v.size}`));
  const notes = el('ul');
  v.notes.forEach((n) => notes.append(el('li', '', n)));
  info.append(notes);

  const link = el('a', 'btn primary', `ดาวน์โหลด ${v.file}`);
  link.href = `${REPO}/${v.tag}/${v.file}`;

  card.append(info, link, el('p', 'hash', `SHA-256: ${v.sha256}`));
  return card;
}

fetch('versions.json')
  .then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  })
  .then((versions) => {
    box.replaceChildren(...versions.map((v, i) => renderVersion(v, i === 0)));
  })
  .catch(() => {
    const fallback = el('a', 'btn ghost', 'เปิดหน้า Releases บน GitHub');
    fallback.href = 'https://github.com/bagidea/hunting/releases';
    box.replaceChildren(el('p', 'muted', 'โหลดรายการเวอร์ชันไม่สำเร็จ'), fallback);
  });
