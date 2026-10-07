# GH Performance

PWA de acompanhamento de treino — **Engenharia do Estímulo Real**.

## O que é
App offline (arquivo único) para personal trainers: alunos, fichas de treino, registro de sessões,
tipos de série, técnicas de periodização, sensor de progressão de carga, avaliação física,
treino em grupo e histórico com gráficos. Tudo salvo no `localStorage` do navegador.

## Como usar
Abra `index.html` no navegador (ou instale pelo botão **⤓ Instalar**). Os dados ficam no
dispositivo — use **Dados e backup** para exportar/importar.

## Montar treino — editar a ficha do aluno
Aba dedicada a montar e ajustar a ficha sem sair da tela (sem modal):

- **+ Nova ficha** / **+ Novo treino** — cria a ficha ou mais um dia de treino
- **+ Exercício** — acrescenta uma linha; o campo do exercício tem **autocomplete** com todos os
  nomes que você já usa (fichas + histórico)
- Campos por exercício: exercício, séries, reps (aceita faixa `6–8` ou blocos `6+4+2`), carga (aceita
  vírgula, ex.: `42,5`), RIR e descanso/observações
- **Duplicar** — cria um treino novo a partir de um existente
- **Copiar p/ aluno** — leva o treino inteiro para a ficha de outro aluno
- **Excluir** — remove o treino inteiro; o `×` de cada linha remove um exercício
- **Prescrever** — itens de texto livre (ex.: “Aquecimento — 5 min de bike”) ficam guardados como
  estão; o botão converte em séries quando você quiser
- **Salvar treino** — grava na hora e confirma (“Salvo ✓”), sem esperar o salvamento automático.
  O botão fica na barra de cima e no rodapé da ficha
- **Registrar** — em cada treino: salva e abre a aba *Registrar treino* com aquele treino já carregado
- A ficha também **salva sozinha** enquanto você digita; o rodapé mostra
  “alterações não salvas” / “salvo ✓”
- **Nada que você não tocou é reescrito**

O botão **Editar** da aba *Fichas de treino* leva direto para esta aba.

## Registro de treino — três tipos de série
Cada exercício monta, ao carregar a ficha:

| Tipo | Papel | Conta no volume? |
|---|---|---|
| **Aquecimento** | Ativação, 35–50% da carga | Não |
| **Reconhecimento** | Calibra a carga do dia, 60–75% | Não |
| **Trabalho** | Série efetiva | **Sim** |

Volume, carga máxima, RIR médio e “séries × reps” consideram **apenas as séries de trabalho**.
O botão **↧ Aquecer** calcula as cargas de preparo a partir da primeira série de trabalho.

## Técnicas por exercício
Tradicional · Rest pause · Cluster set · Drop set · Bi-set/Tri-set · Pirâmide.
Nas técnicas por blocos aparece o campo **Blocos** (ex.: `6+4+2`), cuja soma define as reps da série.
A técnica e os blocos também são detectados automaticamente ao ler a ficha
(ex.: `supino inclinado 4×(6+4) cluster 15s`).

## Sensor de progressão
Lê as séries de trabalho contra a faixa de repetições do exercício e sugere:

- **Pode progredir** — topo da faixa atingido com RIR ≥ 1,5 → aumenta ~2,5% a carga e volta à base
- **Mantenha e progrida reps** — dentro da faixa
- **Segure a carga** — topo atingido com RIR baixo, ou séries no limite
- **Atenção** — alguma série abaixo do mínimo → sugere reduzir ~5%

## Visão geral (painel)
- **Hero** com saudação, objetivo do aluno, sequência de semanas treinadas e ações rápidas
- **6 indicadores**: sessões, exercícios, séries de trabalho, volume, RIR médio e último treino
- **Gráfico de evolução** semanal — volume / séries / treinos, em 4, 8 ou 12 semanas, com tooltip
- **Composição das séries** em rosca (trabalho / reconhecimento / aquecimento) + ranking de
  exercícios por volume
- **Sensor de progressão** consolidado do último treino
- **Dicas do dia** — 22 dicas de treino, técnica, recuperação e nutrição, com rotação manual
- **Notícias & esporte** — feeds de ge.globo, ge Futebol, g1 Bem Estar e Veja Saúde, com imagens,
  cache local de 30 min e degradação silenciosa quando offline

## Estrutura
- `index.html` — o app inteiro (HTML + CSS + JS, sem dependências externas)
- Abas: Visão geral · Fichas de treino · **Montar treino** · Registrar treino · Treino em grupo ·
  Histórico · Avaliação física · Dados e backup
- `sw.js` — service worker (cache offline)
- `manifest.json` / `manifest.webmanifest` — manifest do PWA
- `icons/` — ícones

## Notas
- Os gráficos são desenhados em `<canvas>` puro — nada de bibliotecas externas.
- As notícias usam o serviço público rss2json para contornar o CORS dos feeds. Sem conexão, o app
  mostra a última busca salva.
- A aba **Periodização** foi removida; a periodização agora é feita por exercício (técnica) e pelo
  sensor de progressão. Os dados antigos de periodização seguem preservados no backup.
