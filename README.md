# Controle de Treino — App instalável (PWA)

Aplicativo de acompanhamento de treinos em arquivo único, agora **instalável na tela de início**
(Android, iPhone/iPad, Windows, macOS, Linux) e com **funcionamento offline**.

## Conteúdo

```
controle-treino-local/
├── index.html                 ← o app (HTML/CSS/JS, tudo embutido)
├── manifest.webmanifest       ← identidade do app (nome, ícones, cores)
├── sw.js                      ← service worker (cache offline)
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-512-maskable.png  ← ícone adaptativo (Android)
│   ├── apple-touch-icon.png   ← ícone iOS (180px)
│   └── favicon-64.png
├── servir.sh                  ← servidor local (Linux/macOS)
└── servir.bat                 ← servidor local (Windows)
```

## Por que precisa de um servidor

O navegador **só permite instalar** um PWA quando o app é servido por **HTTPS** (ou `localhost`).
Abrir o `index.html` com duplo clique (`file://`) continua funcionando para usar o app, mas
**não** habilita o botão de instalação / “Adicionar à tela de início”.

---

## Instalação por plataforma

### Android (Chrome / Edge)
1. Publique a pasta em um endereço **HTTPS** (veja “Publicar” abaixo) e abra no navegador.
2. Toque no botão **⤓ Instalar** que aparece no topo do app — ou no menu ⋮ → **Instalar app**.
3. Confirme. O atalho aparece na tela de início e abre em tela cheia, sem barra do navegador.

### iPhone / iPad (Safari)
1. Abra o endereço HTTPS no **Safari**.
2. Toque em **Compartilhar** (□↑) → **Adicionar à Tela de Início** → **Adicionar**.
3. O ícone “Treino” aparece na tela de início.

### Windows / macOS / Linux (Chrome ou Edge)
1. Abra o endereço (HTTPS ou `http://localhost`) no Chrome/Edge.
2. Clique no ícone de **instalar** na barra de endereço, ou menu ⋮ → **Instalar Controle de Treino**.
3. O atalho vai para a área de trabalho / menu Iniciar e abre como janela própria.

---

## Publicar (escolha um)

**Opção A — Netlify Drop (mais rápido, sem conta técnica)**
1. Acesse `https://app.netlify.com/drop`.
2. Arraste a pasta `controle-treino-local` inteira para a página.
3. Em segundos você recebe uma URL `https://…netlify.app` — use-a para instalar.

**Opção B — GitHub Pages**
1. Crie um repositório e envie os arquivos.
2. Settings → Pages → Branch `main` / root → Save.
3. Acesse `https://<usuario>.github.io/<repo>/`.

**Opção C — Vercel / Cloudflare Pages**
Importe a pasta como projeto estático; nenhum build é necessário.

---

## Teste local (na mesma máquina)

- **Windows:** dê dois cliques em `servir.bat`
- **Linux/macOS:** `./servir.sh`

Depois abra `http://localhost:8080`. Nesse endereço o Chrome/Edge permite instalar.
(Instalar a partir de outro dispositivo na mesma rede **não** funciona em `http://` — precisa de HTTPS.)

## Observações

- Os dados ficam no **armazenamento local do navegador** daquele dispositivo. Use
  **Dados e backup → Exportar JSON** para transferir entre aparelhos.
- Ao abrir como app instalado, o service worker mantém tudo disponível **offline**.
