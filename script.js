/* ══════════════════════════════════════════════════════
   Portal PWeb — script.js
   Toda a lógica do portal: dados, navegação, renderização
═══════════════════════════════════════════════════════ */

/* ── 1. DADOS DO PORTAL ────────────────────────────────
   Para adicionar aulas futuras, editar apenas este objeto.
──────────────────────────────────────────────────────── */
const PORTAL_DATA = {
  teoricas: [
    {
      id: "t1",
      titulo: "HTML5 — Fundamentos",
      descricao: "Introdução ao HTML5, estrutura semântica, elementos base.",
      pdf: "docs/Teorica-HTML5.pdf",
    },
    {
      id: 't0',
      titulo: 'Manual de Referência — HTML, CSS, JSON',
      descricao: 'Guia de referência rápida: estrutura HTML, tags, formulários, tabelas, CSS (seletores, flexbox, grid, variáveis), JSON e atalhos Emmet.',
      pdf: 'Teorico/web-manual.html'
    },
    {
      id: 'ref-w3',
      titulo: 'W3Schools — Referência Online',
      descricao: 'Tutorial e referência completa de HTML, CSS, JavaScript, SQL e muito mais. Inclui exemplos interactivos e editor Try it Yourself.',
      pdf: 'https://www.w3schools.com'
    },
  ],

  praticas: [
    {
      id: 'p1',
      titulo: 'Aula 1 — HTML Básico',
      descricao: 'Primeiros passos em HTML: títulos, parágrafos, listas, imagens e links.',
      enunciado: 'docs/Pratica-Aula1-Tarefa.pdf',
      ficheiros: [
        { nome: 'index.html',               path: 'Pratico/Aula 1/index.html',             tipo: 'html' },
        { nome: 'cheatsheet.html',           path: 'Pratico/Aula 1/cheatsheet.html',         tipo: 'html' },
        { nome: 'sem consulta / index.html', path: 'Pratico/Aula 1/sem consulta/index.html', tipo: 'html' }
      ],
      resultado: 'Pratico/Aula 1/index.html'
    },
    {
      id: 'p2',
      titulo: 'Aula 2 — Formulários e Recursos Externos',
      descricao: 'Formulários, CSS externo, JavaScript externo (async/defer), imagens lazy-loading, vídeo.',
      enunciado: 'docs/Pratica-Aula2-Tarefa.pdf',
      ficheiros: [
        { nome: 'index.html',                path: 'Pratico/Aula 2/index.html',                  tipo: 'html' },
        { nome: 'style.css',                 path: 'Pratico/Aula 2/style.css',                   tipo: 'css'  },
        { nome: 'script.js',                 path: 'Pratico/Aula 2/script.js',                   tipo: 'js'   },
        { nome: 'sem consulta / index.html', path: 'Pratico/Aula 2/Sem consulta/index.html',     tipo: 'html' },
        { nome: 'sem consulta / style.css',  path: 'Pratico/Aula 2/Sem consulta/style.css',      tipo: 'css'  }
      ],
      resultado: 'Pratico/Aula 2/index.html'
    },
    // ── Adicionar Aula 3, 4... aqui (ver MANUAL-DEVELOPER.md) ──────────────────
  ],

  prompts: [
    {
      id: 'pr1',
      titulo: 'Aula 1 — Prompt HTML Básico',
      aula: 'Aula 1',
      promptKey: 'Pratico/Aula 1/prompt.txt',
      respostaKey: 'Pratico/Aula 1/resposta-ia.txt'
    },
    {
      id: 'pr2',
      titulo: 'Aula 2 — Prompt PARTS HTML-02',
      aula: 'Aula 2',
      promptKey: 'Pratico/Aula 2/prompt.txt',
      respostaKey: 'Pratico/Aula 2/resposta-ia.txt'
    }
  ],
};

/* ── 2. ESTADO ─────────────────────────────────────── */
let activeAsideItem = null;
let currentSection  = 'home';

/* ── 3. INIT ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setupHeaderNav();
  setupMenuToggle();
  showHome();
});

/* ── 4. HEADER NAV ────────────────────────────────── */
function setupHeaderNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = link.dataset.section;
      setActiveNavLink(link);
      navigateTo(section);
      // close mobile nav if open
      document.getElementById('main-nav').classList.remove('open');
    });
  });
}

function setActiveNavLink(activeLink) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  activeLink.classList.add('active');
}

function navigateTo(section) {
  currentSection = section;
  const aside = document.getElementById('aside');

  if (section === 'home') {
    aside.classList.add('hidden');
    aside.innerHTML = '';
    showHome();
    return;
  }

  // Show aside with section content
  aside.classList.remove('hidden');
  aside.innerHTML = '';
  activeAsideItem = null;

  const configs = {
    teoricas: {
      title: '📚 Aulas Teóricas',
      items: PORTAL_DATA.teoricas,
      icon:  '📄',
      onClickFn: showTeorica
    },
    praticas: {
      title: '💻 Aulas Práticas',
      items: PORTAL_DATA.praticas,
      icon:  '🔬',
      onClickFn: showPratica
    },
    prompts: {
      title: '🤖 Prompts de IA',
      items: PORTAL_DATA.prompts,
      icon:  '💬',
      onClickFn: showPrompt
    }
  };

  const cfg = configs[section];
  if (!cfg) return;

  // Section label
  const label = document.createElement('div');
  label.style.cssText = 'padding:14px 16px 8px;font-size:.72rem;font-weight:700;color:var(--ubi-gold);text-transform:uppercase;letter-spacing:.8px;border-bottom:1px solid var(--border);';
  label.textContent = cfg.title;
  aside.appendChild(label);

  // Items
  cfg.items.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'nav-item';
    el.innerHTML = `<span class="item-icon">${cfg.icon}</span>${item.titulo}`;
    el.addEventListener('click', () => {
      setActiveAsideItem(el);
      cfg.onClickFn(item);
      if (window.innerWidth <= 768) aside.classList.remove('open');
    });
    aside.appendChild(el);

    // Auto-select first item
    if (idx === 0) {
      setTimeout(() => { el.click(); }, 0);
    }
  });
}

function setActiveAsideItem(el) {
  if (activeAsideItem) activeAsideItem.classList.remove('active');
  el.classList.add('active');
  activeAsideItem = el;
}

/* ── 5. HOME VIEW ───────────────────────────────────── */
function showHome() {
  document.getElementById('main-content').innerHTML = `
    <div class="welcome-screen">
      <div class="big-icon">🎓</div>
      <h2>Portal de Programação Web</h2>
      <p>
        Bem-vindo ao portal da disciplina de <strong>Programação Web</strong>,
        Engenharia Informática — 2.º Ano, 2.º Semestre 2025/2026.
      </p>

      <div class="home-cards">
        <div class="home-card" onclick="document.querySelector('[data-section=teoricas]').click()">
          <div class="home-card-icon">📚</div>
          <h3>Aulas Teóricas</h3>
          <p>PDFs das matérias lidos diretamente na página.</p>
        </div>
        <div class="home-card" onclick="document.querySelector('[data-section=praticas]').click()">
          <div class="home-card-icon">💻</div>
          <h3>Aulas Práticas</h3>
          <p>Enunciado, código fonte e resultado de cada exercício.</p>
        </div>
        <div class="home-card" onclick="document.querySelector('[data-section=prompts]').click()">
          <div class="home-card-icon">🤖</div>
          <h3>Prompts de IA</h3>
          <p>Prompts utilizados em cada aula e respostas guardadas.</p>
        </div>
      </div>

      <div class="home-guide">
        <h3>Como navegar</h3>
        <ol>
          <li>Clica num link no <strong>menu do topo</strong> (Teóricas / Práticas / Prompts)</li>
          <li>No <strong>painel lateral</strong> aparecem os conteúdos disponíveis dessa secção</li>
          <li>Clica num item para o ver na <strong>área principal</strong></li>
          <li>Nas Práticas podes ver os ficheiros de código nas <strong>tabs</strong> e abrir o resultado numa nova tab</li>
        </ol>
      </div>
    </div>`;
}

/* ── 6. VISTA TEÓRICA ──────────────────────────────────── */
function showTeorica(t) {
  const main = document.getElementById('main-content');
  const isExternal = t.pdf && t.pdf.startsWith('http');

  main.innerHTML = `
    <div class="section-title">📄 ${t.titulo}</div>
    ${t.descricao ? `<p style="color:var(--text-muted);margin-bottom:20px;line-height:1.6">${t.descricao}</p>` : ''}
    <div class="pdf-block">
      ${isExternal ? `
        <h3>🔗 Recurso Externo</h3>
        <div style="padding:32px;text-align:center;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius)">
          <p style="color:var(--text-muted);margin-bottom:20px">Este recurso está alojado externamente e não pode ser exibido aqui inline.</p>
          <a class="btn-result" href="${t.pdf}" target="_blank" rel="noopener noreferrer">
            🌐&nbsp; Abrir ${t.titulo}
          </a>
        </div>
      ` : `
        <h3>📎 Documento</h3>
        <iframe class="pdf-frame" src="${t.pdf}#toolbar=1" title="${t.titulo}"></iframe>
      `}
    </div>`;
}

/* ── 8. VISTA PRÁTICA ──────────────────────────────────── */
async function showPratica(p) {
  const main = document.getElementById("main-content");

  // Build static skeleton
  main.innerHTML = `
    <div class="section-title">🔬 ${p.titulo}</div>
    ${p.descricao ? `<p style="color:var(--text-muted);margin-bottom:24px;line-height:1.6">${p.descricao}</p>` : ""}

    <div class="pdf-block">
      <h3>📄 Enunciado da Tarefa</h3>
      <iframe class="pdf-frame" src="${p.enunciado}#toolbar=1" title="Enunciado"></iframe>
    </div>

    <div class="code-block">
      <h3>💻 Código Fonte</h3>
      <div class="tabs-bar" id="tabs-bar"></div>
      <div id="tab-panels"></div>
    </div>

    <div class="result-block">
      <h3 style="font-size:.9rem;font-weight:600;color:var(--text-muted);margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px">🚀 Resultado Final</h3>
      <a class="btn-result" href="${p.resultado}" target="_blank">
        ▶&nbsp; Ver Resultado Final
      </a>
    </div>`;

  // Build tabs
  const tabsBar = document.getElementById("tabs-bar");
  const tabPanels = document.getElementById("tab-panels");

  p.ficheiros.forEach((f, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
    btn.textContent = f.nome;
    btn.dataset.idx = i;
    btn.addEventListener('click', () => activateTab(i, p.ficheiros.length));
    tabsBar.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'code-panel' + (i === 0 ? ' active' : '');
    panel.id = `panel-${i}`;
    panel.innerHTML = `<div class="loading-code">A carregar ${f.nome}…</div>`;
    tabPanels.appendChild(panel);

    // Fetch do ficheiro (requer Live Server ou servidor local)
    fetchFileContent(f.path, f.tipo).then(html => {
      panel.innerHTML = `
        <button class="copy-code-btn" onclick="copyCode(${i})">📋 Copiar</button>
        <pre id="code-${i}">${html}</pre>`;
    });
  });
}

function activateTab(idx, total) {
  for (let i = 0; i < total; i++) {
    document
      .querySelectorAll(".tab-btn")
      [i]?.classList.toggle("active", i === idx);
    document
      .getElementById(`panel-${i}`)
      ?.classList.toggle("active", i === idx);
  }
}

function copyCode(idx) {
  const pre = document.getElementById(`code-${idx}`);
  if (!pre) return;
  navigator.clipboard.writeText(pre.innerText).then(() => {
    const btn = document.querySelectorAll(".copy-code-btn")[idx];
    if (btn) {
      btn.textContent = "✅ Copiado!";
      setTimeout(() => (btn.textContent = "📋 Copiar"), 1500);
    }
  });
}

/* ── 9. FETCH + HIGHLIGHT ──────────────────────────────── */
async function fetchFileContent(path, tipo) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    return highlight(escapeHtml(text), tipo);
  } catch (e) {
    return `<span style="color:var(--text-muted);font-style:italic">Não foi possível carregar o ficheiro: ${path}\n(${e.message})</span>`;
  }
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlight(code, tipo) {
  if (tipo === "html") return highlightHTML(code);
  if (tipo === "css") return highlightCSS(code);
  if (tipo === "js") return highlightJS(code);
  return code;
}

function highlightHTML(c) {
  return c
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-cmt">$1</span>')
    .replace(/(&lt;\/?)([\w-]+)/g, '<span class="tok-tag">$1$2</span>')
    .replace(
      /([\w-]+)(=)(&quot;[^&]*&quot;)/g,
      '<span class="tok-attr">$1</span>$2<span class="tok-val">$3</span>',
    );
}

function highlightCSS(c) {
  return c
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-cmt">$1</span>')
    .replace(/([.#]?[\w-]+)\s*\{/g, '<span class="tok-fn">$1</span> {')
    .replace(/([\w-]+)\s*:/g, '<span class="tok-prop">$1</span>:')
    .replace(/:\s*([^;{}\n]+)/g, ': <span class="tok-str">$1</span>');
}

function highlightJS(c) {
  return c
    .replace(/(\/\/[^\n]*)/g, '<span class="tok-cmt">$1</span>')
    .replace(
      /\b(const|let|var|function|return|if|else|for|while|class|new|this|import|export|async|await)\b/g,
      '<span class="tok-kw">$1</span>',
    )
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>')
    .replace(/('[^']*'|`[^`]*`)/g, '<span class="tok-str">$1</span>');
}

/* ── 10. VISTA PROMPT DE IA ────────────────────────────── */
function showPrompt(pr) {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="section-title">🤖 ${pr.titulo}</div>
    <p style="color:var(--text-muted);margin-bottom:24px;line-height:1.6">
      Prompt utilizado na <strong>${pr.aula}</strong> com uma IA (ChatGPT ou similar).
      Para guardar a resposta: cria o ficheiro <code style="background:var(--bg-code);padding:2px 6px;border-radius:4px">resposta-ia.txt</code>
      na pasta da aula e aponta o <code style="background:var(--bg-code);padding:2px 6px;border-radius:4px">respostaFile</code> em <code style="background:var(--bg-code);padding:2px 6px;border-radius:4px">script.js</code>.
    </p>
    <div class="chat-view" id="chat-view"><div style="text-align:center;color:var(--text-muted);padding:40px">A carregar…</div></div>`;

  const chatView = document.getElementById('chat-view');
  chatView.innerHTML = '';

  // Carregar prompt via fetch (requer Live Server)
  if (pr.promptKey) {
    fetch(pr.promptKey)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => chatView.appendChild(makeBubble('👤', 'user-bubble', 'Prompt enviado', text, true)))
      .catch(() => {});
  }

  // Carregar resposta via fetch
  if (pr.respostaKey) {
    fetch(pr.respostaKey)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => chatView.appendChild(makeBubble('🤖', 'ai-bubble', 'Resposta da IA', text, false)))
      .catch(() => chatView.appendChild(makePlaceholder()));
  } else {
    chatView.appendChild(makePlaceholder());
  }
}

function makeBubble(avatar, cls, label, text, showCopy) {
  const wrap = document.createElement("div");
  wrap.className = `chat-bubble ${cls}`;
  wrap.innerHTML = `
    <div class="bubble-avatar">${avatar}</div>
    <div class="bubble-content">
      <div class="bubble-label">${label}</div>
      <div class="bubble-body">${escapeHtml(text)}</div>
      ${
        showCopy
          ? `<div class="bubble-actions">
        <button class="btn-copy-prompt" onclick="copyText(this, \`${text.replace(/`/g, "\\`")}\`)">📋 Copiar Prompt</button>
      </div>`
          : ""
      }
    </div>`;
  return wrap;
}

function makePlaceholder() {
  const d = document.createElement("div");
  d.className = "prompt-placeholder";
  d.innerHTML = `🤖 Ainda não existe resposta guardada.<br>
    Guarda a resposta da IA num ficheiro <code>resposta-ia.txt</code> na pasta da aula<br>
    e actualiza o campo <code>respostaFile</code> em <code>script.js</code>.`;
  return d;
}

function copyText(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "✅ Copiado!";
    setTimeout(() => (btn.textContent = "📋 Copiar Prompt"), 1500);
  });
}

/* ── 11. MENU MOBILE ───────────────────────────────────── */
function setupMenuToggle() {
  const btn  = document.getElementById('menu-toggle');
  const nav  = document.getElementById('main-nav');
  const aside = document.getElementById('aside');

  btn.addEventListener('click', () => {
    // On Home (aside hidden): toggle the header nav
    if (aside.classList.contains('hidden')) {
      nav.classList.toggle('open');
    } else {
      // On a section: toggle the aside
      aside.classList.toggle('open');
      nav.classList.remove('open');
    }
  });

  // Close nav on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && e.target !== btn)
      nav.classList.remove('open');
    if (!aside.contains(e.target) && e.target !== btn)
      aside.classList.remove('open');
  });
}
