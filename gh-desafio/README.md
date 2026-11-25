# GH Desafio — app de check-in (offline)

App instalável no celular do aluno. Funciona **sem internet**, guarda os check-ins no
aparelho e envia sozinho para a planilha quando o celular pega rede.

```
files/gh-desafio/
├── index.html            aplicativo completo (HTML + CSS + JS, sem dependências)
├── manifest.webmanifest  identidade para instalar na tela de início
├── sw.js                 service worker (cache offline)
├── icon-192.png          ícone
├── icon-512.png          ícone
└── tela-*.png            capturas de referência
```

O servidor é o `apps-script-gh-desafio.gs`, que roda dentro da própria planilha.

---

## 1. Endereço publicado

Já está no ar (GitHub Pages, repositório `controle-treino`):

```
https://giovannighs26-bit.github.io/controle-treino/gh-desafio/
```

Para publicar/atualizar: envie os arquivos para a pasta `gh-desafio` do repositório
(`index.html`, `manifest.webmanifest`, `sw.js`, `icones.js`). Pages publica em ~1 minuto.
Não existe ícone `.png` no repositório: os dois ícones ficam em base64 dentro de
`icones.js` e o `sw.js` os serve como PNG — por isso o pacote inteiro é texto.

> HTTPS é obrigatório: sem ele o service worker não registra e o app não abre offline.
> O app precisa abrir a partir dessa URL (não do arquivo baixado direto) para funcionar.

## 2. Instalar no celular

- **Android / Chrome**: abrir o link → menu ⋮ → *Instalar app* (ou *Adicionar à tela inicial*).
- **iPhone / Safari**: abrir o link → botão compartilhar → *Adicionar à Tela de Início*.

Depois disso o ícone **GH Desafio** abre em tela cheia, mesmo em modo avião.

## 3. Banco compartilhado (Firebase) — 3 minutos, sem código

1. Abra https://console.firebase.google.com e faça login com sua conta Google.
2. **Criar projeto** → nome `gh-desafio` → continuar → desative o Analytics → **Criar projeto**.
3. No menu lateral: **Bancos de dados e armazenamento** → **Realtime Database** → **Criar banco de dados**
   - Local: escolha o padrão (Estados Unidos)
   - **Iniciar no modo de teste** → Ativar
4. Copie a URL que aparece no topo, algo como `https://gh-desafio-default-rtdb.firebaseio.com`
   (o trecho antes de `.firebaseio.com` muda conforme o nome do projeto).
5. No app: **Ajustes → Endereço do banco** → cole → **Salvar e testar**.
6. **Ajustes → Copiar link já configurado** → envie para os outros dois. Quem abrir por esse link já entra conectado.

O modo de teste expira em 30 dias. Para continuar valendo, em **Realtime Database → Regras** deixe:

```json
{ "rules": { ".read": true, ".write": true } }
```

Qualquer pessoa com a URL consegue ler e escrever — para um desafio entre três amigos é o nível de
privacidade esperado. Não use para dados sensíveis.

## 4. Nomes dos participantes

Ajustes → **Lista de alunos** (um nome por linha) ou **Buscar nomes do grupo** (traz quem já sincronizou).

## 4.1 Novo ciclo / reset

Em **Ajustes → Novo ciclo / reset**:

- **Novo ciclo só neste aparelho** — apaga os check-ins locais e zera a contagem; mantém nomes e conexão.
- **Apagar registros de todos (grupo)** — apaga os registros no banco compartilhado (vale para os três),
  grava a data de início de hoje e zera o aparelho. Exige digitar `APAGAR`.

A data de início do ciclo também é compartilhada: quem resetar o grupo define o dia 1 para todos.

## 5. Operação diária

**Aluno**: abre o app → escolhe o nome → informa cardio (min), água (L) e peso (kg),
foto se quiser → *Salvar check-in*. Acabou. Não precisa de sinal.

**Regra de pontuação** (tudo configurável em `Config`):

| Item | Ponto | Padrão |
|---|---|---|
| Check-in do dia | 1 | sempre |
| Cardio | 1 | se ≥ meta de cardio (20 min) |
| Água | 1 | se ≥ meta de água (3 L) |
| Peso registrado | 1 | se o peso do dia foi informado |

**Metas configuráveis** em *Ajustes → Metas do check-in*: cardio (min), água (L), sono (h),
peso (registro), passos e proteína. Cada meta ligada vale 1 ponto (valor editável) e o check-in
sempre vale 1. Máximo padrão: **5 pontos/dia** (com passo e proteína ligados, 7).
Ciclo de 30 dias; meta do ciclo padrão 120 pontos.

**Treinador**: abre a planilha. O Registro Diário recebe a linha, o Painel soma os
pontos e Ranking, Semanal e Dashboard se atualizam sozinhos.

## 6. O que o sistema garante

- **Offline real**: o check-in é gravado antes de qualquer rede. A fila reenvia ao
  abrir o app, ao voltar o sinal e a cada 90 segundos.
- **Um check-in por dia**: reenviar no mesmo dia **corrige** o registro anterior
  (delta recalculado no Painel), não duplica.
- **Regra única**: o servidor recalcula os pontos a partir de `Config!C11..C16`,
  então a regra do app e da planilha nunca divergem.
- **Foto**: vai comprimida (~1.000 px, JPEG), é salva na pasta `GH Desafio — Fotos`
  do Drive e o link entra na coluna *Link Foto*.
- **Data retroativa**: o app aceita "Hoje" e "Ontem".
- **Grupo (feed compartilhado)**: a aba Grupo mostra quem já registrou hoje, o ranking
  e os registros de todos dos últimos 14 dias, com foto. Lido da planilha.
- **Gráfico semanal, sequência, peso e conquistas** ficam no próprio app (aba Progresso).
- **Backup**: exporta/importa um .json com todos os check-ins do aparelho.
- **Peso compartilhado é opcional**: `Config!C17` = "Não" esconde o valor dos outros
  (o app mostra "peso ok" em vez do número).

## 7. Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| "Não consegui falar com a planilha" | implantação não é "Qualquer pessoa", ou URL não termina em `/exec` | refaça a implantação e cole a URL certa |
| 3 pontinhos no chip e nada envia | código de acesso diferente do script | igualar nos dois lados |
| Nome não aparece na lista | nome vazio no Painel ou sem conexão | preencher o nome na planilha e tocar em *Atualizar lista* |
| App não abre offline | acessou por HTTP ou pelo arquivo local | instalar a partir do link do GitHub Pages |
| Check-in gravou no dia errado | fuso do celular | conferir a data mostrada na tela antes de salvar |

## 8. Atualizar o app depois

Alterou `index.html`? Suba o arquivo **e** incremente a versão no `sw.js`:

```js
const VERSAO = "gh-desafio-v2";
```

Sem isso os celulares continuam servindo o cache antigo.
