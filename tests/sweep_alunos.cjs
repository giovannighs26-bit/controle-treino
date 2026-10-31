const { launch } = require("./_pw.cjs");

const BASE = process.argv[2] || process.env.BASE || "http://localhost:8910/";
const R = [];
const ok = (n, c, extra) => { R.push([c ? "OK " : "FALHA", n, extra || ""]); };

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 }, locale: "pt-BR", acceptDownloads: true });
  const page = await ctx.newPage();
  const erros = [];
  page.on("pageerror", e => erros.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error" && !/rss2json|ERR_FAILED|CORS|net::/.test(m.text())) erros.push(m.text()); });
  page.on("dialog", d => d.accept());

  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    const st = {
      version: 1, seedApplied: 1, avSeedApplied: 1, avNextSeed: 1,
      auth: { name: "Giovanni Soares", email: "a@b.c", hash: "x" },
      activeStudentId: "ariana",
      students: [
        { id: "ariana", name: "Ariana Costa de Faria", goal: "Emagrecimento", level: "Intermediário", tag: "ATIVO · 4 TREINOS", plans: [{ title: "Ficha", days: [{ title: "A", items: ["Stiff — 3×12; 60 s"] }, { title: "B", items: ["Supino — 3×12; 60 s"] }] }] },
        { id: "daniele", name: "Daniele de A. Paula", goal: "Hipertrofia", level: "Iniciante", tag: "ATIVO · 3 TREINOS", plans: [{ title: "F", days: [{ title: "A", items: ["Leg press — 4×10"] }] }] },
        { id: "giovanna", name: "Giovanna Garcia Araújo", goal: "Definição", level: "Avançado", tag: "", plans: [] },
      ],
      plans: {},
      sessions: [{ id: "s1", studentId: "ariana", date: "2026-10-20", exercises: [] }],
      assessments: [{ id: "a1", studentId: "ariana", date: "2026-10-01", sex: "F", measures: {}, folds: {}, photos: { front: [], side: [], back: [] } }],
      group: { n: 4, date: "2026-10-28", time: "07:00", slots: [
        { studentId: "ariana", dayIndex: 0, dayTitle: "A", exercises: [{ name: "Stiff", sets: 3 }] },
        { studentId: "", dayIndex: 0, dayTitle: "", exercises: [] },
        { studentId: "", dayIndex: 0, dayTitle: "", exercises: [] },
        { studentId: "", dayIndex: 0, dayTitle: "", exercises: [] }] },
      finance: { settings: {}, students: { ariana: { tel: "11987654321", valor: 350, dia: 5, ativo: true, desde: "2026-01" } }, payments: [] },
      agenda: { seedAulas: 1, cfg: { dias: [1,2,3,4,5], ini: '07:00', fim: '23:00', passo: 30, minMin: 30 },
        bloques: [], prio: [], evitar: [],
        aulas: [
          { id: 'x1', studentId: 'ariana', nome: 'Ariana C.', dia: 1, ini: '07:00', fim: '08:00', ativo: true },
          { id: 'x2', studentId: 'daniele', nome: 'Dani', dia: 1, ini: '09:00', fim: '10:00', ativo: true },
        ] },
      portal: {}, alertaDias: 7, newsCache: { at: 0, items: [] },
    };
    localStorage.setItem("ghPerformance.v1", JSON.stringify(st));
    localStorage.setItem("ghPerformance.authed", "1");
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1600);

  const S = () => page.evaluate(() => JSON.parse(localStorage.getItem("ghPerformance.v1")));

  // ---------- 1. estado inicial ----------
  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(700);
  let st = await S();
  ok("estado inicial: 3 alunos, todos ativos", st.students.every(s => s.active !== false));
  ok("contador mostra ativos/inativos", /ativo/i.test(await page.textContent("#alCount")), await page.textContent("#alCount"));

  // ---------- 2. desativar pela UI ----------
  const linhas = await page.$$eval(".al-row", els => els.length);
  const antes = await page.$$eval("[data-al-toggle]", els => els.length);
  ok("cada aluno tem botão Ativar/Desativar", antes === linhas && linhas >= 3, antes + " botões / " + linhas + " linhas");
  await page.click('[data-al-toggle="ariana"]');
  await page.waitForTimeout(900);

  st = await S();
  const ari = st.students.find(s => s.id === "ariana");
  ok("s.active ficou false", ari.active === false);
  ok("etiqueta virou INATIVO", /^INATIVO/.test(ari.tag), ari.tag);
  ok("financeiro acompanhou (mensalidade inativa)", st.finance.students.ariana.ativo === false);
  ok("slot do treino em grupo liberado", st.group.slots[0].studentId === "", JSON.stringify(st.group.slots[0].studentId));
  ok("badge INATIVO na lista", (await page.$$(".al-badge-off")).length === 1);
  ok("linha esmaecida (classe off)", (await page.$$(".al-row.off")).length === 1);
  const cnt = await page.textContent("#alCount");
  ok("contador 2 ativos · 1 inativo", /2 ativo/.test(cnt) && /1 inativo/.test(cnt), cnt);

  // ---------- 3. seletores ----------
  const opcoes = await page.$$eval("#activeStudent option", os => os.map(o => o.textContent));
  ok("seletor do topo marca (inativo)", opcoes.some(t => /Ariana.*\(inativo\)/.test(t)), opcoes.join(" | "));
  const avOp = await page.$$eval("#avStudent option", os => os.map(o => o.textContent));
  ok("seletor da avaliação marca (inativo)", avOp.some(t => /Ariana.*\(inativo\)/.test(t)), avOp.join(" | "));
  await page.click('.tab[data-page="grupo"]');
  await page.waitForTimeout(800);
  const grpOp = await page.$$eval(".grp-col select", sels => sels.length ? [...sels[0].options].map(o => o.textContent) : null);
  ok("treino em grupo não oferece inativo", grpOp ? !grpOp.some(t => /Ariana/.test(t)) : false, grpOp ? grpOp.join(" | ") : "sem seletor");

  // ---------- 4. agenda ----------
  await page.click('.tab[data-page="agenda"]');
  await page.waitForTimeout(900);
  st = await S();
  const aulasAriana = (st.agenda.aulas || []).filter(a => a.studentId === "ariana");
  const inativas = await page.$$eval(".ag2-aula.inativo", els => els.length);
  const totalBlocos = await page.$$eval(".ag2-aula", els => els.length);
  ok("agenda: aula da Ariana marcada como inativa", inativas === 1 && aulasAriana.length === 1,
     inativas + " de " + totalBlocos + " blocos marcados · " + aulasAriana.length + " aula(s) no estado");

  // ---------- 5. financeiro ----------
  await page.click('.tab[data-page="financeiro"]');
  await page.waitForTimeout(800);
  const finTxt = await page.textContent("#finTabela, #financeiro");
  ok("financeiro mostra status inativo", /inativ/i.test(finTxt), (/inativ/i.test(finTxt) ? "status Inativo presente" : "não encontrado"));

  // ---------- 6. modal de sincronização ----------
  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(500);
  await page.click("#alSyncBtn");
  await page.waitForTimeout(500);
  ok("modal de sincronização abre", await page.isVisible("#syncModal .modal-box"));
  const txtSync = await page.textContent("#syncBody");
  ok("varredura reporta situação", /3 aluno/i.test(txtSync), txtSync.slice(0, 90).replace(/\s+/g, " "));

  // força uma inconsistência e confere se a varredura pega
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem("ghPerformance.v1"));
    st.finance.students.ariana.ativo = true;                 /* diverge de propósito */
    st.students.find(s => s.id === "ariana").tag = "ATIVO · 4 TREINOS";
    localStorage.setItem("ghPerformance.v1", JSON.stringify(st));
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(500);
  await page.click("#alSyncBtn");
  await page.waitForTimeout(400);
  const antesFix = await page.textContent("#syncBody");
  ok("detecta divergência de financeiro", /Financeiro/.test(antesFix), (antesFix.match(/Financeiro/g) || []).length + " ocorrência(s)");

  await page.click("#syncFixBtn");
  await page.waitForTimeout(800);
  const depoisFix = await page.textContent("#syncBody");
  ok("Sincronizar tudo zera as pendências", /Tudo sincronizado/.test(depoisFix), depoisFix.slice(0, 80).replace(/\s+/g, " "));
  st = await S();
  ok("após sincronizar, financeiro volta a inativo", st.finance.students.ariana.ativo === false);

  // ---------- 7. persistência ----------
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1400);
  st = await S();
  ok("situação persiste após recarregar", st.students.find(s => s.id === "ariana").active === false);
  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(600);
  ok("badge continua na lista após reload", (await page.$$(".al-badge-off")).length === 1);

  // ---------- 8. reativar ----------
  await page.click('[data-al-toggle="ariana"]');
  await page.waitForTimeout(900);
  st = await S();
  const ari2 = st.students.find(s => s.id === "ariana");
  ok("reativar volta active=true", ari2.active === true);
  ok("etiqueta volta a ATIVO", /^ATIVO/.test(ari2.tag), ari2.tag);
  ok("financeiro reativado", st.finance.students.ariana.ativo === true);
  ok("badge some", (await page.$$(".al-badge-off")).length === 0);

  // ---------- 9. filtro ----------
  await page.selectOption("#alFiltro", "inativos");
  await page.waitForTimeout(400);
  ok("filtro Inativos mostra lista vazia", (await page.$$("[data-al-toggle]")).length === 0);
  await page.selectOption("#alFiltro", "ativos");
  await page.waitForTimeout(400);
  const nAtivosFiltro = (await page.$$("[data-al-toggle]")).length;
  ok("filtro Ativos mostra todos", nAtivosFiltro === linhas, nAtivosFiltro + " de " + linhas);
  await page.selectOption("#alFiltro", "todos");

  // ---------- 10. varredura de todas as abas ----------
  const tabs = await page.$$eval(".tab[data-page]", els => els.map(e => e.dataset.page));
  for (const t of tabs) { await page.click(`.tab[data-page="${t}"]`); await page.waitForTimeout(320); }
  ok("todas as " + tabs.length + " abas abrem", true, tabs.join(","));
  ok("nenhum erro de console/página", erros.length === 0, erros.slice(0, 4).join(" | "));

  console.log("\n=== VARREDURA GERAL ===");
  R.forEach(([s, n, e]) => console.log(`${s} ${n}${e ? "  →  " + e : ""}`));
  const falhas = R.filter(r => r[0] === "FALHA").length;
  console.log(`\n${R.length - falhas}/${R.length} verificações OK`);
  await browser.close();
  process.exit(falhas ? 1 : 0);
})();
