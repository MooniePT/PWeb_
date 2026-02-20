# Manual do Developer — Portal PWeb

> Ficheiro pessoal — não aparece no portal.

---

## ⚠️ Requisito: Live Server

Instala a extensão **Live Server** no VS Code (Pedro Zamora). Depois:

- **Botão direito** em `index.html` → **"Open with Live Server"**
- Ou clica em **"Go Live"** na barra inferior do VS Code

> Sem Live Server, os ficheiros de código não carregam nos tabs.

---

## ➕ Adicionar uma Aula Prática

**Passo 1** — Cria a pasta e os ficheiros do exercício normalmente:

```
Pratico/
└── Aula 3/
    ├── index.html
    ├── style.css
    └── script.js
```

**Passo 2** — Copia o PDF do enunciado para `docs/`:

```
docs/Pratica-Aula3-Tarefa.pdf
```

**Passo 3** — Abre `script.js` e adiciona na secção `praticas: [...]`:

```javascript
{
  id: 'p3',
  titulo: 'Aula 3 — CSS Básico',
  descricao: 'Seletores, box model, flexbox.',
  enunciado: 'docs/Pratica-Aula3-Tarefa.pdf',
  ficheiros: [
    { nome: 'index.html', path: 'Pratico/Aula 3/index.html', tipo: 'html' },
    { nome: 'style.css',  path: 'Pratico/Aula 3/style.css',  tipo: 'css'  },
    { nome: 'script.js',  path: 'Pratico/Aula 3/script.js',  tipo: 'js'   },
  ],
  resultado: 'Pratico/Aula 3/index.html'
},
```

**Isso é tudo.** Refresca o browser e a aula aparece.

---

## ➕ Adicionar uma Aula Teórica (PDF)

Copia o PDF para `docs/` e adiciona em `script.js` dentro de `teoricas: [...]`:

```javascript
{ id: 't2', titulo: 'CSS — Fundamentos', descricao: '...', pdf: 'docs/Teorica-CSS.pdf' },
```

---

## ➕ Adicionar um Prompt de IA

### Estrutura de ficheiros

Mantém o prompt e a resposta na pasta da aula — não precisas de pasta separada:

```
Pratico/
└── Aula 3/
    ├── index.html
    ├── prompt.txt           ← prompt do prof (texto simples)
    └── resposta-ia.txt      ← resposta da IA (copias e colas aqui)
```

### Workflow passo a passo

**Passo 1** — Guarda o prompt em `Pratico/Aula N/prompt.txt`

**Passo 2** — Envia o prompt ao ChatGPT / Gemini / Claude / Perplexity...

**Passo 3** — Copia a resposta completa e cola num ficheiro `resposta-ia.txt` na mesma pasta

**Passo 4** — Adiciona em `script.js` dentro de `prompts: [...]`:

```javascript
{
  id: 'pr3',
  titulo: 'Aula 3 — Prompt CSS',
  aula: 'Aula 3',
  promptFile:   'Pratico/Aula 3/prompt.txt',
  respostaFile: 'Pratico/Aula 3/resposta-ia.txt'
},
```

**Resultado:** o portal mostra o prompt numa bolha azul e a resposta da IA numa bolha cinzenta.

> **Ainda não tens a resposta?** Usa `respostaFile: null` — o portal mostra um placeholder.

### Comparar respostas de IAs diferentes

Cria um ficheiro por IA e adiciona entradas separadas em `script.js`:

```javascript
{ id: 'pr3a', titulo: 'Aula 3 — ChatGPT', aula: 'Aula 3',
  promptFile: 'Pratico/Aula 3/prompt.txt',
  respostaFile: 'Pratico/Aula 3/resposta-chatgpt.txt' },

{ id: 'pr3b', titulo: 'Aula 3 — Gemini', aula: 'Aula 3',
  promptFile: 'Pratico/Aula 3/prompt.txt',
  respostaFile: 'Pratico/Aula 3/resposta-gemini.txt' },
```

---

## ✅ Checklist rápida para nova aula

- [ ] Criar `Pratico/Aula N/` com os ficheiros
- [ ] Copiar PDF → `docs/Pratica-AulaN-Tarefa.pdf`
- [ ] Adicionar entrada em `script.js`
- [ ] Abrir com **Live Server** e refrescar
