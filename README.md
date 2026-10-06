# GH Performance

PWA de acompanhamento de treino — **Engenharia do Estímulo Real**.

## O que é
App offline (arquivo único) para personal trainers: alunos, fichas de treino, registro de sessões,
técnicas de intensidade, sensor de progressão de carga e histórico com gráfico. Tudo salvo no
`localStorage` do navegador.

## Acesso
Na primeira abertura o app pede para **criar seu acesso** (nome, e-mail e senha).
O acesso fica salvo **apenas neste dispositivo** — não há servidor. Marque *Manter conectado*
para não digitar a senha sempre.

## Instalar
- **Android/Chrome:** abra o endereço e toque em **⤓ Instalar**.
- **iPhone/Safari:** Compartilhar → *Adicionar à Tela de Início*.
- **PC:** ícone de instalar na barra de endereço.

## Registro de treino — como funciona
Cada exercício é registrado em **três tipos de série**:

| Tipo | Papel | Entra no volume/fadiga? |
|---|---|---|
| **Aquecimento** | Ativação articular e muscular, carga leve | Não |
| **Reconhecimento** | Reconhece a carga do dia (≈70%) antes das séries fortes | Não |
| **Trabalho** | Série efetiva com a carga de trabalho | **Sim** — é a única que conta |

Ao carregar um treino da ficha, o app já monta 1 série de aquecimento + 1 de reconhecimento +
as séries de trabalho previstas. O botão **↧ Aquecer** calcula as cargas de preparo (40% e 70%)
a partir da primeira série de trabalho. O tipo de cada série pode ser trocado no seletor **Tipo**.

### Técnica / periodização do exercício
Cada exercício tem um seletor de **técnica**, aplicada só naquele exercício:
Tradicional · **Rest pause** · **Cluster set** · Drop set · Bi-set/Tri-set · Pirâmide.
Quando a técnica usa blocos (rest pause, cluster, drop), aparece o campo **Blocos** —
digite `6+4+2` e o total de reps da série é calculado automaticamente.
A técnica detectada na própria ficha (`4×(6+4) cluster`) já vem marcada.

### Sensor de progressão
O sensor analisa as **séries de trabalho** e a faixa de repetições do exercício (Reps mín/máx):

- **Pode progredir** — bateu o topo da faixa com folga de RIR → sugere a nova carga
  (≈+2,5%, mínimo +1 kg) e manda **voltar para o mínimo de repetições** (aumenta peso, reduz reps).
- **Mantenha e progrida reps** — dentro da faixa → mantenha a carga e busque o topo em todas as séries.
- **Segure a carga** — topo atingido mas com RIR muito baixo, ou séries no limite.
- **Atenção** — alguma série abaixo do mínimo de reps → sugere reduzir ≈5%.

O sensor aparece ao vivo em cada exercício, no resumo da sessão e no cartão
**Sensor de progressão** da Visão geral. O exercício também mostra a **última vez**
(carga × reps × RIR) para servir de referência.

## Estrutura
| Arquivo | Função |
|---|---|
| `index.html` | O app completo (HTML + CSS + JS + fundo e ícones embutidos) |
| `manifest.json` | Manifesto do PWA (`orientation: any` → gira livre) |
| `sw.js` | Service worker — cache offline (`gh-performance-v6`) |
| `icons/` | Ícones SVG da marca GH |

## Base de dados inicial
O app já vem com a base de alunos e fichas de treino do GH Performance (17 alunos, 68 treinos).
Novos alunos podem ser cadastrados em **+ Aluno**.

## Backup
**Dados e backup → Exportar JSON** gera um arquivo com tudo. Use **Importar JSON** para restaurar
em outro aparelho ou navegador.
