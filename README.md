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

- **+ Nova ficha** / **+ Novo treino** / **+ Adicionar treino/dia** — cria a ficha ou mais um dia de
  treino (o botão aparece na barra de cima e também no rodapé da ficha)
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

### As abas ficam sincronizadas
A aba *Registrar treino* guarda uma cópia do dia da ficha. Se você editar a ficha depois, ela se
atualiza sozinha:

- **Sem nada digitado na tela** — o treino é recarregado automaticamente, sem aviso
- **Com trabalho já feito** (carga digitada ou série marcada) — **nada é apagado**. Aparece uma faixa
  dourada avisando que a ficha mudou, com o botão **↻ Recarregar da ficha**
- **Ao trocar de aluno no topo** — a ficha é gravada antes da troca e o treino do aluno novo é
  carregado; se houver trabalho na tela, a faixa avisa em vez de apagar

Ao entrar em *Fichas de treino*, *Visão geral*, *Histórico*, *Treino em grupo* ou *Avaliação física*,
a aba é redesenhada com os dados atuais.

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

## Financeiro — gestão das mensalidades
Aba de cobrança dos alunos, mês a mês. Os dados ficam em `state.finance` (dentro do mesmo backup).

**Por aluno:** mensalidade, dia de vencimento, desconto, plano, WhatsApp, observações e
**cobrar a partir de** (o mês em que ele entrou — antes disso o app não cobra nem marca atraso).

**Por mês:**
- **6 indicadores** — previsto, recebido, em aberto, em atraso, taxa de recebimento e ticket médio
- **Gráfico de evolução** de 6 meses, comparando previsto × recebido
- **Rosca da situação do mês** — quanto está pago, pendente, atrasado e parcial
- **Tabela de mensalidades** com filtros por situação, busca por nome e ordenação por urgência
  (atrasados primeiro)
- **Alertas** — quantos estão em atraso, quanto há a receber e quem ainda está sem mensalidade

**Ações rápidas em cada linha:**
- **✓** registra o pagamento já com o valor em falta preenchido
- **💬** copia a cobrança pronta e abre o WhatsApp do aluno (se o telefone estiver cadastrado)
- **⚙** abre a ficha financeira do aluno: histórico de lançamentos, total do ano, meses em atraso

**Pagamentos:** mensalidade, avulsa/extra ou outro; valor, data, forma (PIX, dinheiro, cartão,
transferência) e observação. Pagamento parcial é aceito e a linha passa a mostrar o que falta.
Qualquer lançamento pode ser excluído no histórico do aluno.

**Ajustes:** nome do titular, chave PIX, valor padrão, dia de vencimento padrão e o texto da
mensagem de cobrança (com `{aluno}`, `{primeiro}`, `{mes}`, `{valor}`, `{venc}`, `{plano}`,
`{pix}` e `{titular}`). Os valores podem ser aplicados em massa a quem não tem valor, a todos os
ativos, ou só o dia de vencimento.

**CSV do mês** — uma linha por aluno com valor, vencimento, situação, pago, em falta e último
pagamento, mais os totais. Separado por `;` e com BOM, abre direto no Excel.

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
  Histórico · Avaliação física · **Financeiro** · Dados e backup
- `sw.js` — service worker (cache offline)
- `manifest.json` / `manifest.webmanifest` — manifest do PWA
- `icons/` — ícones

## Notas
- Os gráficos são desenhados em `<canvas>` puro — nada de bibliotecas externas.
- As notícias usam o serviço público rss2json para contornar o CORS dos feeds. Sem conexão, o app
  mostra a última busca salva.
- A aba **Periodização** foi removida; a periodização agora é feita por exercício (técnica) e pelo
  sensor de progressão. Os dados antigos de periodização seguem preservados no backup.
