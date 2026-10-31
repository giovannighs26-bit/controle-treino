const { launch } = require("./_pw.cjs");
const BASE = process.argv[2] || process.env.BASE || "http://localhost:8910/";
const R = [];
const ok = (n, c, e) => R.push([c ? "OK " : "FALHA", n, e || ""]);

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "pt-BR" });
  const page = await ctx.newPage();
  const erros = [];
  page.on("pageerror", e => erros.push("pageerror: " + e.message + " @ " + (e.stack||"").split("\n")[1]));
  page.on("console", m => { if (m.type() === "error" && !/rss2json|ERR_FAILED|CORS|net::/.test(m.text())) erros.push(m.text()); });
  page.on("dialog", d => d.accept());

  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    /* Cenário corrompido: dois cadastros com o MESMO id e ficha com título de outro aluno */
    const st = { version: 1, seedApplied: 1, avSeedApplied: 1, auth: { name: "Giovanni", email: "a@b.c", hash: "x" }, activeStudentId: "ariana",
      students: [
        { id: "ariana", name: "Ariana Costa de Faria", goal: "Emagrecimento", level: "Intermediário", tag: "ATIVO" },
        { id: "ariana", name: "Lorena Araújo Minelli", goal: "Definição", level: "Iniciante", tag: "ATIVO" },
        { id: "daniele", name: "Daniele de A. Paula", goal: "Hipertrofia", level: "Iniciante", tag: "ATIVO" }],
      plans: {
        ariana: { title: "Ficha — Lorena Araújo", days: [{ title: "Treino A", items: ["Leg press — 4×10 (120 kg); 90 s"] }] },
        daniele: { title: "Ficha — Daniele", days: [{ title: "Treino A", items: ["Stiff — 3×12; 60 s"] }] } },
      sessions: [], assessments: [], group: null, finance: null, portal: {}, agenda: null, alertaDias: 7, newsCache: { at: 0, items: [] } };
    localStorage.setItem("ghPerformance.v1", JSON.stringify(st));
    localStorage.setItem("ghPerformance.authed", "1");
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const S = () => page.evaluate(() => JSON.parse(localStorage.getItem("ghPerformance.v1")));

  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(600);
  ok("lista mostra os 3 cadastros", (await page.$$("[data-al-toggle]")).length === 3);

  // ---- 1. dono visível no editor ----
  await page.click('[data-al-pane="treino"]');
  await page.waitForTimeout(500);
  const dono = await page.textContent("#mtFicha .al-ficha-dono");
  ok("editor mostra de quem é a ficha", /Ariana/.test(dono), dono.replace(/\s+/g, " "));
  const titulo = await page.inputValue("#mtPlanTitle");
  ok("título atual está trocado (Lorena)", /Lorena/.test(titulo), titulo);

  // ---- 2. auditoria ----
  await page.click("#alReparar");
  await page.waitForTimeout(500);
  const txt = await page.textContent("#fichaBody");
  ok("auditoria aponta id duplicado", /id duplicado/i.test(txt), txt.replace(/\s+/g, " ").slice(0, 130));
  ok("auditoria aponta título trocado", /título trocado/i.test(txt));
  const btnOk = await page.isEnabled("#fichaCorrigirAgora");
  ok("botão corrigir habilitado", btnOk);

  // ---- 3. corrigir ----
  await page.click("#fichaCorrigirAgora");
  await page.waitForTimeout(1200);
  let st = await S();
  const ids = st.students.map(s => s.id);
  ok("ids únicos após correção", new Set(ids).size === ids.length, ids.join(","));
  const lorena = st.students.find(s => /Lorena/.test(s.name));
  ok("Lorena ganhou ficha própria", !!(st.plans[lorena.id] && st.plans[lorena.id].days.length),
     JSON.stringify(Object.keys(st.plans)));
  ok("título da Ariana corrigido", !/Lorena/.test(st.plans.ariana.title), st.plans.ariana.title);
  ok("ficha da Ariana não perdeu exercício", st.plans.ariana.days[0].items.length === 1);
  ok("ficha da Lorena tem o exercício", (st.plans[lorena.id].days[0].items || []).length === 1);

  // ---- 4. desfazer ----
  await page.click("#alReparar");
  await page.waitForTimeout(400);
  await page.click("#fichaUndo");
  await page.waitForTimeout(900);
  st = await S();
  ok("desfazer volta os ids duplicados", new Set(st.students.map(s => s.id)).size < st.students.length,
     st.students.map(s => s.id).join(","));

  // ---- 5. sincronizar tudo corrige ----
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(500);
  await page.click("#alSyncBtn");
  await page.waitForTimeout(500);
  const syncTxt = await page.textContent("#syncBody");
  ok("painel de sincronização lista o problema", /Fichas/.test(syncTxt), syncTxt.replace(/\s+/g, " ").slice(0, 120));
  await page.click("#syncFixBtn");
  await page.waitForTimeout(1200);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  st = await S();
  ok("Sincronizar tudo também corrige os nomes", new Set(st.students.map(s => s.id)).size === st.students.length);

  // ---- 6. trocar de aluno troca a ficha ----
  await page.click('[data-al-pane="treino"]');
  await page.waitForTimeout(400);
  await page.click('[data-al-toggle]');
  await page.click('.al-row:nth-child(3) .al-pick').catch(async () => {
    const rows = await page.$$(".al-pick"); if (rows[1]) await rows[1].click();
  });
  await page.waitForTimeout(800);
  const dono2 = await page.textContent("#mtFicha .al-ficha-dono");
  ok("editor acompanha o aluno selecionado", /Daniele|Lorena/.test(dono2), dono2.replace(/\s+/g, " "));

  ok("sem erro de console", erros.length === 0, erros.slice(0, 3).join(" | "));

  console.log("\n=== FICHAS COM NOMES TROCADOS ===");
  R.forEach(([s, n, e]) => console.log(`${s} ${n}${e ? "  →  " + e : ""}`));
  const f = R.filter(r => r[0] === "FALHA").length;
  console.log(`\n${R.length - f}/${R.length} verificações OK`);
  await browser.close();
  process.exit(f ? 1 : 0);
})();
