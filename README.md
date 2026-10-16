# GH Performance

PWA de acompanhamento de treino — **Engenharia do Estímulo Real**.

## O que é
App offline (arquivo único) para personal trainers: alunos, fichas de treino, registro de sessões,
tipos de série, técnicas de periodização, sensor de progressão de carga, avaliação física,
treino em grupo e histórico com gráficos. Tudo salvo no `localStorage` do navegador.

## Como usar
Abra `index.html` no navegador (ou instale pelo botão **⤓ Instalar**). Os dados ficam no
dispositivo — use **Dados e backup** para exportar/importar.

## Base de fichas (aba *Dados e backup*)

O app já vem com as fichas dos alunos da base GH Performance. Na aba **Dados e backup** há o botão
**⟳ Aplicar base de fichas**:

- **Sem marcar** a caixa *"Substituir também as fichas já existentes"* (padrão) — cria os alunos que
  faltam e **preenche só as fichas vazias**. O que você já editou não é tocado. Ao terminar, o app
  informa quantas foram criadas, preenchidas, substituídas e quantas já estavam ok.
- **Marcando** a caixa — substitui **todas** as fichas pelas da base (com confirmação). É o caminho
  para voltar ao conteúdo original de um aluno.

### Trazer a ficha da base para o aluno ativo
Nem toda ficha vazia está na base e nem todo aluno tem a ficha vazia. Por isso a aba
A parte **Editar ficha** (aba *Fichas de treino*) tem o botão **↧ Trazer da base**, ao lado de *+ Novo treino*:

- Ele procura na base a ficha **do aluno ativo** (pelo nome).
- **Ficha vazia** → aplica direto, sem perguntar.
- **Ficha com conteúdo** → pergunta: **OK substitui** a ficha atual pela da base; **Cancelar
  acrescenta** os treinos da base no fim, preservando o que já estava lá.

É o caminho para atualizar um aluno que já tem ficha sem passar pelo *Substituir também as fichas
já existentes* da aba *Dados e backup* (que troca **todas** as fichas de uma vez).

### Letícia e Fabiana — Ciclo ajustado (A/B/C)
As fichas da **Letícia Aparecida Teodoro** e da **Fabiana Aparecida dos Santos Teodoro** estão na base
com o ciclo ajustado de 3 treinos (23 exercícios cada), com a **mesma prescrição** e o **ajuste
individual** de cada uma nas observações:

| Treino | Exercícios |
|---|---|
| **A Ajustado — Inferiores 1** | Leg Press 45° · Búlgaro no Smith · Cadeira extensora · Cadeira abdutora · Elevação pélvica · Panturrilha · Prancha lateral adaptada |
| **B — Superiores, postura e proteção articular** | Puxada frente na polia · Remada baixa neutra · Supino máquina ou halteres · Desenvolvimento · Elevação lateral · Face pull · Tríceps corda · Rosca alternada · Pallof press ou prancha inclinada |
| **C Ajustado — Inferiores 2** | Mesa/cadeira flexora · Stiff com halteres · Elevação pélvica · Agachamento sumô com halter · Abdução máquina ou cabo · Glúteo no cabo/coice · Dead bug + respiração |

Cada exercício traz o **cue do professor** e, em seguida, a orientação específica da aluna — por
exemplo, no Búlgaro no Smith a Letícia tem *"progredir carga gradualmente se mantiver o alinhamento"*
e a Fabiana *"começar com amplitude menor, não buscar falhar, priorizar core e equilíbrio"*.

### Ariana — Inferior/Superior 4x
A ficha da **Ariana Costa de Faria** está na base com 4 treinos (24 exercícios), todos com preparo
padrão 1 aquecimento + 1 reconhecimento + séries de trabalho:

| Treino | Exercícios |
|---|---|
| **A — Inferior Posterior/Glúteo** (Segunda) | Stiff com Halteres · Cadeira Flexora · Leg Press 45° · Elevação Pélvica (Máquina) · Cadeira Abdutora |
| **B — Superior Empurrar** (Terça) | Supino na Máquina · Supino Inclinado com Halteres · Crucifixo na Máquina · Ombro com Halteres · Tríceps Corda · Elevação Lateral |
| **C — Inferior Quadríceps/Glúteo** (Quarta, presencial) | Agachamento no Smith · Cadeira Extensora · Leg Press 45° · Cadeira Abdutora · Elevação Pélvica · Coice Máquina · Stiff Máquina |
| **D — Superior Puxar** (Sexta) | Puxada Frente Máquina · Remada Baixa · Remada Curvada com Halteres · Puxada Unilateral · Bíceps Rosca Direta · Puxador Traseiro |

Se a ficha dela estiver vazia no seu aparelho, abra **Dados e backup** e toque em
**⟳ Aplicar base de fichas** — só a ficha dela é preenchida.

## Fichas de treino — a aba única da ficha
A aba **Fichas de treino** reúne tudo o que antes estava espalhado em três telas (*Fichas de treino*,
*Montar treino* e *Registrar treino*, que deixaram de existir). Ela tem três partes, na ordem:

1. **Lista de treinos** — cada treino com os botões **Registrar** (anota as séries numa tela só),
   **Guiado** (conduz exercício por exercício, em tela cheia, com descanso) e **Editar** (abre o editor
   já naquele treino). Acima: *PDF da ficha*, *Compartilhar com o aluno*, *Importar ficha* e *+ Nova ficha*.
2. **Editar ficha** — o editor completo, na própria tela (sem modal), descrito abaixo.
3. **Registro rápido** — a ficha inteira numa tela: marque as séries feitas, ajuste carga, reps e RIR
   e salve. É o antigo *Registrar treino*.

O fluxo natural é: criar o aluno → fazer a **Avaliação física** → montar a ficha em *Fichas de treino*
→ registrar pelo **Registrar** ou pelo **Guiado**.

### Editar a ficha (parte 2)

- **+ Nova ficha** / **+ Novo treino** / **+ Adicionar treino/dia** — cria a ficha ou mais um dia de
  treino (o botão aparece na barra de cima e também no rodapé da ficha)
- **+ Exercício** — acrescenta uma linha; o campo do exercício tem **autocomplete** com todos os
  nomes que você já usa (fichas + histórico)
- Campos por exercício: exercício, **preparo (aq/rec)**, **séries de trabalho**, reps (aceita faixa
  `6–8` ou blocos `6+4+2`), carga (aceita vírgula, ex.: `42,5`), RIR e descanso/observações
- **Preparo aq/rec — o padrão do app**: todo exercício novo já nasce com **1 aquecimento + 1
  reconhecimento de carga + 3 séries de trabalho**. Os dois campos ao lado de *Séries trab.* são as
  quantidades de aquecimento e de reconhecimento (padrão `1` e `1`); mude-os só quando quiser fugir
  do padrão — por exemplo `2` e `0` para duas ativações e nenhum reconhecimento
- As **3 séries de trabalho** seguem a faixa de reps da ficha (`8–12`, por exemplo), e só elas contam
  para o volume e para a fadiga — aquecimento e reconhecimento são registrados, mas ficam de fora
- O preparo é gravado junto do exercício **apenas quando foge do padrão 1+1**; as fichas que já
  existem continuam idênticas e seguem valendo 1 aquecimento + 1 reconhecimento
- **Duplicar** — cria um treino novo a partir de um existente
- **Copiar p/ aluno** — leva o treino inteiro para a ficha de outro aluno
- **Excluir** — remove o treino inteiro; o `×` de cada linha remove um exercício
- **Prescrever** — itens de texto livre (ex.: “Aquecimento — 5 min de bike”) ficam guardados como
  estão; o botão converte em séries quando você quiser
- **Salvar treino** — grava na hora e confirma (“Salvo ✓”), sem esperar o salvamento automático.
  O botão fica na barra de cima e no rodapé da ficha
- **Registrar** — em cada treino: salva a ficha e carrega aquele treino no **Registro rápido**, logo abaixo
- **Carregar treino** — modo guiado: escolhe o aluno e o treino do dia, a tela fica cheia e o app
  conduz **exercício por exercício**, com **descanso em cada série** e um play para o cronômetro;
  ao concluir, o treino é gravado no histórico e entra na evolução do aluno
- **Treino em grupo** — o mesmo modo guiado para **até 4 alunos de uma vez**, com a tela dividida em
  quadrantes independentes: cada aluno no seu exercício, todas as séries visíveis de uma vez,
  e uma sessão gravada por aluno
- A ficha também **salva sozinha** enquanto você digita; o rodapé mostra
  “alterações não salvas” / “salvo ✓”
- **Nada que você não tocou é reescrito**

O botão **Editar** da aba *Fichas de treino* leva direto para esta aba.

### Carregar treino (modo guiado)
A aba **Carregar treino** conduz a sessão do começo ao fim:

- Escolha o **aluno** e o **treino do dia** e toque em **▶ Iniciar** — a tela fica cheia e o
  cronômetro do topo começa a contar a duração da sessão
- Um **exercício por vez**, com as séries da ficha já preenchidas (reps, carga, RIR e o tipo de
  cada série). Cada série tem o **play do descanso** com o tempo prescrito; ao marcar **Feita**,
  o descanso começa sozinho, com pausa e **+30s** dentro da própria tela
- **Próximo exercício →** libera quando você marca pelo menos uma série daquele exercício;
  **Pular** avança sem marcar e **←** volta
- No fim, **Concluir treino ✓** grava a sessão no **mesmo formato da aba *Registrar treino*** —
  ou seja, aparece no **Histórico**, conta na **evolução**, nos **recordes** e no painel
- Sair no meio do treino oferece salvar as séries marcadas como **sessão parcial**

### Treino em grupo — modo guiado (tela dividida)
A aba **Treino em grupo** também tem um modo guiado, para conduzir **até 4 alunos ao mesmo tempo**:

- Monte as colunas (aluno + treino do dia) e toque em **▶ Iniciar treino guiado**
- A tela fica cheia e **dividida em até 4 quadrantes** (2×2), um por aluno, com o nome, o exercício
  atual e a linha de alvo (`4×6–8 · 40 kg · 90s descanso`)
- **Cada aluno é independente**: o cursor do exercício é de cada um. Um aluno pode estar no
  exercício 2 enquanto o outro segue no 1, e nada trava a aula de ninguém
- **Todas as séries do exercício atual ficam visíveis de uma vez**, empilhadas embaixo do exercício —
  não precisa ir para a próxima para registrar. Cada linha traz o selo do tipo
  (**AQU** aquecimento · **REC** reconhecimento · **TRB** trabalho) e os campos **Reps, Carga e RIR**,
  com a caixa de **feita** na ponta direita
- O quadrante mostra ainda uma prévia do **próximo exercício** (nome e alvo), para o aluno já se preparar
- **Próximo →** só libera depois que **todas as séries do exercício atual** estiverem marcadas; aí o
  aluno avança sozinho. **←** volta um exercício e **↷** pula o exercício inteiro (exceções)
- **Seletor de técnica por exercício** — Tradicional, **Rest pause**, **Cluster set**, Drop set,
  Bi-set/Tri-set e Pirâmide. Escolhendo rest pause, cluster ou drop, o campo **Reps** dá lugar a
  **Blocos** (ex.: `8+4`), e as repetições passam a ser a soma dos blocos
- **Cronômetro e descanso são de cada aluno**, não compartilhados. O relógio no cabeçalho do
  quadrante (`00:12:34`) conta o tempo daquele aluno e **congela quando ele conclui** o treino;
  o botão **▶ 60s** dispara o descanso **só dele** (o do vizinho não é afetado). Enquanto corre, o
  botão vira a contagem (`00:47`); toque de novo para pausar
- A barra do topo mostra o **progresso geral** (`12 de 85 séries preenchidas · 14%`)
- No fim, **Concluir treino ✓** grava **uma sessão por aluno**, todas com o mesmo `groupId` e
  `groupSize` — então cada uma entra no histórico, nos recordes e na evolução do respectivo aluno
- Sair no meio salva as séries marcadas como **sessões parciais**
- No celular os quadrantes ficam **lado a lado** e rolam dentro de si, sem rolagem horizontal na página

**Itens de orientação da ficha.** Muita ficha começa com uma linha sem prescrição — *"Bike/esteira leve
5 min + mobilidade"*, *"Aquecimento: caminhada 3 min"*, *"Cardio — 40 min"*. Esses itens **não são
exercício**: aparecem no quadrante como uma **NOTA** (`Item de orientação — sem séries para registrar`),
sem campos de reps/carga/RIR, sem descanso e sem exigir preenchimento — basta ler e tocar em
**Próximo →**. Eles também não entram na sessão gravada nem no volume. Vale igual na aba
*Fichas de treino → Registro rápido*, onde aparecem como um cartão tracejado.

### Agenda — quadro da semana
A aba *Agenda* mostra a semana inteira num **quadro de horários**:

- Colunas = dias (Seg a Sex), linhas = horas, do primeiro horário com aula até o último
- Cada aluno aparece como um **bloco colorido** com nome curto e horário
- Quando **dois alunos dividem o mesmo horário**, os blocos ficam **lado a lado** (ex.: segunda 17:00
  com Giovanna e Rueny) — é assim que o treino em grupo aparece na agenda
- Os horários **livres** são blocos **tracejados verdes** com o intervalo (`+ livre 08:00-17:00`).
  **Clique num bloco livre para agendar uma aula ali**; clique no bloco de um aluno para editar
- Abaixo do quadro, *Horários livres* lista as janelas de cada dia e *Encaixe recomendado* sugere onde
  cabe uma aula nova

A agenda já vem preenchida com a grade semanal dos alunos (carregada uma única vez — depois disso
você edita à vontade, e nada é reescrito por cima).

### As abas ficam sincronizadas
O **Registro rápido** guarda uma cópia do dia da ficha. Se você editar a ficha depois, ela se
atualiza sozinha:

- **Sem nada digitado na tela** — o treino é recarregado automaticamente, sem aviso
- **Com trabalho já feito** (carga digitada ou série marcada) — **nada é apagado**. Aparece uma faixa
  dourada avisando que a ficha mudou, com o botão **↻ Recarregar da ficha**
- **Ao trocar de aluno no botão flutuante** (canto inferior direito) — a ficha é gravada antes da
  troca e o treino do aluno novo é carregado; se houver trabalho na tela, a faixa avisa em vez de apagar

Ao entrar em *Fichas de treino*, *Visão geral*, *Histórico*, *Treino em grupo* ou *Avaliação física*,
a aba é redesenhada com os dados atuais.

**O aluno ativo é o mesmo em todas as abas.** A aba *Avaliação física* acompanha o aluno escolhido
em qualquer lugar do app — e trocar o aluno no seletor dela troca o aluno ativo de todo o app, então
o laudo, a ficha e o financeiro nunca ficam apontando para pessoas diferentes.

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

**O que a aba mostra:** KPIs do mês (previsto, recebido, em aberto, em atraso, taxa de recebimento,
ticket médio e **recebido no ano**), alertas acionáveis, gráfico de evolução de 6 meses, rosca da
situação do mês e a tabela de mensalidades dos alunos.

- A tabela lista **só os alunos reais** (o cadastro interno *Usuário* não entra) e traz o cabeçalho
  **fixo** ao rolar, com linhas zebradas
- A coluna **Plano** só aparece quando algum aluno tem plano definido — sem plano, ela não ocupa espaço
- As ações de cada linha são **✓** registrar pagamento · **💬** cobrar no WhatsApp · **📄** abrir a
  ficha financeira (valor, vencimento, desconto e histórico). Todas com `title` e `aria-label`
- Ao lado do seletor de mês aparece o mês **em português** (`Outubro de 2026`) — o campo
  `<input type="month">` é renderizado no idioma do navegador e não dá para traduzir
- A rosca mostra apenas as categorias que existem no mês, sem linhas de "R$ 0,00 · 0%"

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

**Recibo de pagamento** — na ficha financeira do aluno, "🧾 Recibo do mês" gera o recibo em PDF
(janela de impressão) com valor, mês, forma, PIX e linha de assinatura; "💬 Copiar recibo" copia a
versão em texto para colar no WhatsApp. Cada lançamento do histórico também tem o seu próprio recibo.

## PDF da ficha e do relatório de avaliação
- **🖨 PDF da ficha** (aba Fichas de treino) — ficha completa do aluno: dados, objetivo, nível, todos
  os treinos com exercício, séries, repetições (faixa, ex. `6–8`), carga, RIR e descanso.
- **🖨 PDF do relatório** (aba Avaliação física) — avaliação selecionada com idade, IMC e
  classificação, perímetros, dobras, % de gordura, massas e as fotos do dia.

Nos dois casos abre a janela de impressão: escolha **Salvar como PDF**. No celular use
Compartilhar → Imprimir → Salvar em PDF.

## Mover uma avaliação para outro aluno
Cada avaliação no histórico da aba *Avaliação física* tem o botão **Mover**, ao lado de *Editar* e
*Excluir*. Ele serve para corrigir uma avaliação lançada no aluno errado sem precisar digitar tudo
de novo.

- O modal mostra a data e o aluno atual, e lista os outros alunos num seletor.
- **Mover avaliação** (padrão) — a avaliação sai do cadastro antigo e passa para o novo. Todos os
dados vão junto: data, peso, altura, idade, medidas, dobras, % de gordura, observações, examinador
**e as fotos**. Só muda o dono.
- **Manter uma cópia para o aluno atual** — marcando a caixa, a origem fica com a avaliação e o
destino recebe uma cópia (útil quando dois alunos treinam juntos e fazem a mesma avaliação).
- Se o destino **já tiver uma avaliação naquela data**, o modal avisa antes de confirmar.

O gráfico de evolução, o comparativo com a primeira avaliação e o relatório em PDF passam a
considerar a avaliação no novo aluno assim que a mudança é confirmada.

## Modo Aluno — a ficha no celular do aluno
O botão **🔗 Compartilhar com o aluno** (aba Fichas de treino) gera um link que contém a ficha
inteira comprimida dentro dele mesmo.

- O aluno abre **sem login e sem instalar nada**; funciona offline depois de aberto.
- Ele vê os treinos do dia e **marca os exercícios feitos**, com barra de progresso — a marcação fica
  guardada no aparelho dele.
- **Nada é enviado para a internet** e o app do treinador não aparece nesse modo: o link abre apenas
  a ficha daquele aluno.
- O link tem cerca de 1,3 KB (6 treinos / 43 exercícios) e pode ser enviado pelo WhatsApp direto do
  próprio modal.

### Avaliação física no app do aluno
O modal de compartilhar tem duas opções:

- **Incluir avaliação física** (ligada por padrão) — acrescenta ao link a avaliação mais recente e as
  anteriores, com peso, altura, IMC, % de gordura, massas gorda e magra, soma das dobras, todas as
  medidas, a comparação com a avaliação anterior e as observações. Custa poucos KB.
- **Incluir fotos no link** (desligada por padrão) — embute as fotos da avaliação como miniaturas
  (620 px, JPEG 62%). O link cresce rápido: o próprio modal mostra o tamanho e avisa quando fica longo
  demais, porque **o WhatsApp corta mensagens acima de ~65 mil caracteres**.

### App do aluno (arquivo único, com fotos)
O botão **⬇ Baixar app do aluno (.html)**, no mesmo modal, gera um arquivo único com **tudo embutido**:
ficha, avaliação completa e **as fotos**. O aluno abre no celular, funciona offline e pode adicionar à
tela inicial.

- O arquivo tem duas abas: **Treino** (marcável, com progresso) e **Avaliação** (com as fotos e
  ampliação em tela cheia ao tocar).
- As fotos usadas são as da **avaliação mais recente que tenha foto**, e a data aparece no título da
  galeria.
- É a forma recomendada de enviar as fotos: o arquivo vai por WhatsApp, e-mail ou Drive.

### Área do aluno (portal: ativar e enviar o link)
Aba **Área do aluno** — o painel de gestão do acesso do aluno. Cada aluno tem uma linha com:

- **Ativar portal** (interruptor) — ao ligar, o link daquele aluno é **gerado na hora**.
- **🔗 Gerar link** / **🖼 Com fotos** — gera (ou regera) o link da **área de evolução** do aluno.
  "Com fotos" embute as fotos e deixa o link bem maior (o WhatsApp corta acima de ~65 mil caracteres).
  O link abre em `#av=...` e cai **direto na tela de evolução** — não abre o app do treinador nem a
  ficha de treino.
- **💬 WhatsApp** — copia a mensagem pronta e abre a conversa do aluno (usa o telefone cadastrado no
  **Financeiro**; sem telefone, só copia e avisa).
- **▶ Apresentar** — abre a tela de apresentação da avaliação em tela cheia.
- **⬇ App (.html)** — baixa o app do aluno em arquivo único, com ficha, avaliação e fotos.

No topo: o resumo **"X de Y com portal ativado"**, o filtro (Todos / Com portal / Sem portal) e as
ações em massa **🔗 Gerar links dos ativados**, **⬇ Baixar lista (.csv)** (nome + status + link de
cada aluno) e **Ativar todos com ficha**.

- Aluno **sem avaliação** fica com os botões de link desabilitados (o portal precisa de pelo menos
  uma avaliação); o botão **▶ Apresentar** continua funcionando. O **⬇ App (.html)** só é habilitado
  com ficha cadastrada.
- O status de cada portal fica salvo no aparelho (`state.portal`) e entra no backup em JSON.
- O link (`#av=...`) abre **sem login** e **offline**, direto na **área de evolução**: resultado atual,
  gráfico de evolução, comparativo com a primeira avaliação, medidas e fotos antes/depois. A ficha de
  treino **não** é exposta ali — para isso existe o **⬇ App (.html)**.
- Como tudo vai dentro do link, **regenere e reenvie** depois de uma avaliação nova.

#### O link tem `?v=` — não remova
Os links saem como `.../controle-treino/?v=34#av=...`. Esse `?v=` é obrigatório: ele muda a URL e
**fura o cache do service worker**. Sem ele, quem já tem o app instalado continuava recebendo o
`index.html` velho do cache (que não conhece `#av=`) e o link abria o app do treinador em vez da área
de evolução — foi exatamente esse o bug relatado.

- O número do `?v=` é o `APP_V` no `index.html` e tem de ser bumpado **junto** com o
  `gh-performance-vN` do `sw.js`.
- Além disso, o `sw.js` passou a servir o **HTML em rede-primeiro** (cache só como reserva offline),
  então esse tipo de problema não volta a acontecer depois que o app se atualiza.
- Links antigos (sem `?v=`) podem abrir a versão velha na primeira vez em aparelhos que já tinham o
  app instalado — **regenere e reenvie** os links do portal.

### Tela de apresentação da avaliação (só avaliação atual + evolução)
Pensada para **apresentar ao aluno**, no seu celular ou no tablet, sem abrir o app inteiro. O botão
**▶ Apresentar ao aluno** fica na aba **Avaliação física** (e também no modal de compartilhar).

- Abre em **tela cheia** dentro do próprio app (nada de download) e fecha no botão **✕ Fechar
  apresentação** ou com **Esc**.
- Mostra **somente** o resultado da avaliação atual e a evolução — **não** lista as avaliações
  anteriores nem a ficha de treino.
- **Números animados** (peso, IMC com classificação, % de gordura, massa gorda, massa magra, soma das
  dobras, altura).
- **Gráfico de evolução interativo**: escolha a métrica (Peso / % de gordura / Massa magra / IMC /
  Dobras) e veja a linha, o intervalo de datas e o **total da mudança**.
- **Desde a primeira avaliação**: quanto mudou em cada indicador.
- **Medidas** atuais com a variação em relação à avaliação anterior.
- **Antes e depois**: comparador de fotos com **linha arrastável** (mais antiga × mais recente com
  foto) e galeria com ampliação em tela cheia.
- O botão **⬇ Baixar tela (.html)** gera o mesmo conteúdo em **arquivo único, offline**, para enviar
  ao aluno.

## Alertas na Visão geral
O card de alertas avisa quando há algo pedindo ação:

- alunos **sem treino há X dias ou mais** — o X é configurável ali mesmo no card (3, 5, 7, 10, 14, 21 ou 30
  dias; padrão 7) e fica guardado no seu aparelho;
- alunos **com ficha e nenhum treino registrado**;
- alunos **sem ficha cadastrada**;
- **aniversariantes do mês** (a data vem do nascimento informado na última avaliação);
- **mensalidades em atraso** no mês, com o total a receber.

Cada linha é clicável e leva direto ao aluno.

## Fotos, backup e compressão
- As fotos são **reduzidas no próprio aparelho** (máx. 1600 px, JPEG ~82%) antes de irem para o
  IndexedDB — uma foto de 676 KB vira ~156 KB. Se o navegador não conseguir processar, a foto
  original é mantida (nunca se perde).
- **Exportar JSON** guarda tudo menos as fotos (arquivo leve).
- **Exportar com fotos** gera um backup completo, com as imagens embutidas — use este para levar os
  dados para outro aparelho.
- Os backups automáticos feitos a cada importação são **podados**: só os 3 mais recentes ficam, para
  o armazenamento não estourar.

## Sensor de progressão
Lê as séries de trabalho contra a faixa de repetições do exercício e sugere:

- **Pode progredir** — topo da faixa atingido com RIR ≥ 1,5 → aumenta ~2,5% a carga e volta à base
- **Mantenha e progrida reps** — dentro da faixa
- **Segure a carga** — topo atingido com RIR baixo, ou séries no limite
- **Atenção** — alguma série abaixo do mínimo → sugere reduzir ~5%

## Recordes pessoais e relatório de evolução
Cada série de trabalho alimenta o **1RM estimado** (fórmula de Epley: carga × (1 + reps/30)).

- O card **Recordes pessoais** lista os melhores resultados por exercício (carga, reps, data e 1RM).
- Ao salvar um treino que bate um recorde, o app avisa: “🏆 N novo(s) recorde(s)”.
- O botão **Relatório de evolução** gera um PDF com os KPIs do aluno, evolução semanal, recordes e os
  últimos treinos.

## Backup automático
- O app guarda um **snapshot automático** do estado a cada 5 minutos, no próprio aparelho.
- O card **Backup** na Visão geral mostra o último snapshot e a última exportação, e sinaliza quando
  passam 14 dias sem exportar.
- **Exportar backup agora** baixa o JSON completo; **Restaurar último snapshot** volta o estado ao
  último ponto automático.

## Busca global e biblioteca de exercícios
- **Buscar** (ou **Ctrl/Cmd + K**) procura alunos, páginas e exercícios de uma vez.
- Ao montar a ficha, o campo de exercício sugere uma **biblioteca base** com cerca de 75 exercícios
  comuns, além de tudo o que já apareceu no seu histórico.

## Tema claro
- O botão ☀️/🌙 no topo alterna entre o tema escuro (padrão) e o claro; a escolha fica salva no aparelho.

## Exportar CSV do histórico
- Na aba **Histórico**, o botão **Exportar CSV** baixa todas as séries do aluno ativo, prontas para o
  Excel (separador `;` e BOM).

## Segurança do acesso
- A senha do painel é guardada com **PBKDF2-SHA256 (100 mil iterações, com sal)**. Acessos antigos,
  criados com o formato anterior, são atualizados automaticamente no primeiro login.

## Alunos — a primeira aba
Tudo o que é do aluno mora aqui; a Visão geral ficou só com os indicadores do treino.

- **Lista de todos os alunos**, em ordem alfabética, com as iniciais, o nº de treinos e o nº de
  sessões; **busca** por nome, objetivo ou nível (o contador mostra `filtrados/total`)
- **+ Aluno** abre o cadastro; clicar num nome o torna o **aluno ativo** de todo o app
- **✎ Editar** em cada linha abre o cadastro do aluno com **nome, objetivo, nível, situação, sexo,
  nascimento e altura**. Sexo, nascimento e altura são **os mesmos dados que a Avaliação física usa** —
  preencha aqui uma vez e a avaliação já vem pronta; salvar uma avaliação também atualiza o cadastro
- **🗑 Excluir** em cada linha apaga o aluno **por inteiro**: cadastro, ficha, avaliações e fotos,
  sessões, financeiro e o lugar dele na agenda e no treino em grupo. Pede uma confirmação que diz
  exatamente o que será apagado, e não pode ser desfeito
- **Botão flutuante de aluno** (canto inferior direito, em todas as telas) — mostra as iniciais e o
  primeiro nome do aluno ativo e abre o **seletor de aluno**: busca por nome/objetivo/nível, a ficha
  de cada um e a **situação do mês no financeiro** (Pago · Em aberto · Atrasado · Parcial). Sobe
  sozinho quando o cronômetro de descanso aparece, para não ficar embaixo dele
- **Perfil** do aluno ativo (nome, objetivo, nível, contato) com acesso direto à edição
- **Financeiro** — situação do mês, valor, vencimento e o que foi recebido, com atalho para a aba
- **Ficha ativa** — nome da ficha, nº de treinos e de exercícios, com botão para abrir
- **Últimos treinos** — as 5 sessões mais recentes do aluno, com data, volume e séries

## Tela cheia

O app é feito para usar em tela cheia no celular, e ela **se recupera sozinha**:

- O navegador **só entra em tela cheia com um toque do usuário**, então depois de recarregar a página
  o app **reaproveita o primeiro toque** e volta para a tela cheia — não precisa procurar o botão
- Se a tela cheia cair por qualquer motivo (recarregar, voltar de outro app, girar o aparelho), o app
  **rearma** e devolve no próximo toque
- **Fechar um treino guiado não tira você da tela cheia** — terminar o treino não é motivo para sair
- O botão **⤢ Tela cheia** é quem manda: se você sair por ele, o app **respeita a escolha** e não
  volta sozinho nem depois de recarregar. Ligando pelo botão, ele volta a se recuperar
- A escolha fica gravada no aparelho (`ghPerformance.telaCheia`)

### No app instalado (atalho na tela inicial)
O manifesto usa **`display: standalone`** — a janela abre **sem a barra do navegador** e continua
assim em qualquer navegação ou recarregamento. O modo `fullscreen` do manifesto foi **removido de
propósito**: no Android o Chrome não o honra no lançamento e acaba mostrando a barra de endereço.

- **Sem barra do navegador**: garantido pelo `standalone`
- **Sem a barra de status** (relógio/bateria): use o botão **⤢ Tela cheia**, que é a API de tela
  cheia de verdade — precisa de um toque, por isso não pode ser automático

> Ao mudar o modo de exibição, o Android só aplica depois de reinstalar o atalho: remova o ícone da
> tela inicial e adicione de novo (Chrome → menu → *Instalar aplicativo*).

## Geral — sobre o app
Aba final, informativa: o que o app é e como ele se comporta.

- **Sobre o app** — o que faz, funciona offline, instalável, sem bibliotecas externas
- **Seus dados** — ficam só no aparelho, nada vai para servidores; aviso sobre limpar o navegador
- **Backup** — exportar JSON, exportar com fotos e os 3 backups automáticos, com atalho para a aba
- **Instalar como app** — passo a passo para Android, iPhone e computador
- **Guia das abas** — o que cada uma das 10 abas faz, com link direto para abrir
- **Como escrever um exercício** — formato do item, separador `;` do descanso, técnicas e RIR
- **Sobre esta versão** — resumo do que está guardado (alunos, treinos e fichas)

## Visão geral (painel)
- **Botão flutuante de aluno** no canto — troca o aluno ativo de qualquer tela, sem ocupar espaço
- **Hero** com saudação conforme a hora do aparelho — *bom dia* (5h–11h59), *boa tarde* (12h–17h59),
  *boa noite* (18h–4h59) — seguida do objetivo do aluno, da sequência de semanas treinadas e das
  ações rápidas. A saudação não traz mais o nome do aluno
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
- Abas em ordem de uso, do cadastro ao acompanhamento, separadas por 6 grupos:
  1. **Visão geral**
  2. Cadastro e avaliação: **Alunos** · **Avaliação física**
  3. Montagem do treino: **Fichas de treino**
  4. Execução: **Carregar treino** · Treino em grupo
  5. Acompanhamento e gestão: Histórico · Agenda · **Financeiro**
  6. Sistema: Dados e backup · **Geral**
- O topo tem só as ações do app (instalar, tela cheia, sair) — a troca de aluno é feita na aba
  **Alunos**
- `sw.js` — service worker (cache offline)
- `manifest.json` / `manifest.webmanifest` — manifest do PWA
- `icons/` — ícones (o favicon é `icon.svg`; o ícone de atalho do iPhone vai embutido no
  `index.html` como data-URI, porque o repositório não guarda o PNG)

## Notas
- Os gráficos são desenhados em `<canvas>` puro — nada de bibliotecas externas.
- As notícias usam o serviço público rss2json para contornar o CORS dos feeds. Sem conexão, o app
  mostra a última busca salva.
- A aba **Periodização** foi removida; a periodização agora é feita por exercício (técnica) e pelo
  sensor de progressão. Os dados antigos de periodização seguem preservados no backup.
- Os PDFs (ficha, relatório e recibo) usam a janela de impressão do navegador — nenhuma biblioteca
  externa é baixada.
- Os ícones que davam erro 404 (`apple-touch-icon.png` e `icon-512.png`, que não existem no
  repositório) foram removidos das referências.
