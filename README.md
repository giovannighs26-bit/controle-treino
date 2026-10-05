# GH Performance

PWA de acompanhamento de treino — **Engenharia do Estímulo Real**.

## O que é
App offline (arquivo único) para personal trainers: alunos, fichas de treino, registro de sessões,
periodização, progressão de cargas e histórico com gráfico. Tudo salvo no `localStorage` do navegador.

## Acesso
Na primeira abertura o app pede para **criar seu acesso** (nome, e-mail e senha).
O acesso fica salvo **apenas neste dispositivo** — não há servidor. Marque *Manter conectado*
para não digitar a senha sempre.

## Instalar
- **Android/Chrome:** abra o endereço e toque em **⤓ Instalar**.
- **iPhone/Safari:** Compartilhar → *Adicionar à Tela de Início*.
- **PC:** ícone de instalar na barra de endereço.

## Estrutura
| Arquivo | Função |
|---|---|
| `index.html` | O app completo (HTML + CSS + JS + fundo e ícones embutidos) |
| `manifest.json` | Manifesto do PWA (`orientation: any` → gira livre) |
| `sw.js` | Service worker — cache offline (`gh-performance-v1`) |
| `icons/` | Ícones SVG da marca GH |

## Base de dados inicial
O app já vem com a base de alunos e fichas de treino do GH Performance (17 alunos, 68 treinos).
Novos alunos podem ser cadastrados em **+ Aluno**.

## Backup
**Dados e backup → Exportar JSON** gera um arquivo com tudo. Use **Importar JSON** para restaurar
em outro aparelho ou navegador.
