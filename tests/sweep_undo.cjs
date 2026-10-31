const { launch } = require("./_pw.cjs");
const BASE = process.argv[2] || process.env.BASE || "http://localhost:8910/";
const R = [];
const ok = (n, c, e) => R.push([c ? "OK " : "FALHA", n, e || ""]);

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "pt-BR" });
  const page = await ctx.newPage();
  const erros = [];
  page.on("pageerror", e => erros.push("pageerror: " + e.message + " @ " + (e.stack || "").split("\n")[1]));
  page.on("console", m => { if (m.type() === "error" && !/rss2json|ERR_FAILED|CORS|net::/.test(m.text())) erros.push(m.text()); });
  page.on("dialog", d => d.accept());

  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.setItem("ghPerformance.v1", JSON.stringify({ version: 1, seedApplied: 1, avSeedApplied: 1, auth: { name: "G", email: "a@b.c", hash: "x" }, activeStudentId: "ariana",
      students: [
        { id: "ariana", name: "Ariana Costa de Faria", goal: "Emagrecimento", level: "Intermediário", tag: "ATIVO" },
        { id: "daniele", name: "Daniele de A. Paula", goal: "Hipertrofia", level: "Iniciante", tag: "ATIVO" }],
      plans: { ariana: { title: "Ficha Ariana", days: [
        { title: "Treino A", items: ["Stiff — 3×12; 60 s", "Leg press — 4×10; 90 s"] },
        { title: "Treino B", items: ["Supino — 3×12; 60 s"] }] } },
      sessions: [], assessments: [], group: null, finance: null, portal: {}, agenda: null, alertaDias: 7, newsCache: { at: 0, items: [] } }));
    localStorage.setItem("ghPerformance.authed", "1");
    localStorage.setItem("ghPerformance.alPane", "treino");
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1600);
  const S = () => page.evaluate(() => JSON.parse(localStorage.getItem("ghPerformance.v1")));

  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(700);
  ok("editor aberto no painel Treino", await page.isVisible("#mtFicha .mt-day"));

  // ---------- 1. excluir treino + desfazer ----------
  const antes = (await S()).plans.ariana.days.length;
  await page.click('#mtFicha [data-delday="1"]');
  await page.waitForTimeout(900);
  let st = await S();
  ok("treino excluído", st.plans.ariana.days.length === antes - 1, st.plans.ariana.days.length + " treino(s)");
  ok("barra de desfazer apareceu", await page.isVisible("#undoBar.show"), (await page.textContent("#undoMsg")) || "");
  await page.click("#undoBtn");
  await page.waitForTimeout(900);
  st = await S();
  ok("desfazer restaurou o treino", st.plans.ariana.days.length === antes, st.plans.ariana.days.length + " treino(s)");

  // ---------- 2. excluir aluno + desfazer ----------
  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(400);
  await page.click('[data-al-del="daniele"]');
  await page.waitForTimeout(1200);
  st = await S();
  ok("aluno excluído", !st.students.some(s => s.id === "daniele"), st.students.map(s => s.name).join(", "));
  ok("barra de desfazer apareceu (aluno)", await page.isVisible("#undoBar.show"), (await page.textContent("#undoMsg")) || "");
  await page.click("#undoBtn");
  await page.waitForTimeout(1200);
  st = await S();
  ok("desfazer restaurou o aluno", st.students.some(s => s.id === "daniele"));

  // ---------- 3. versões da ficha ----------
  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(500);
  await page.click('[data-al-pane="treino"]');
  await page.waitForTimeout(500);
  // edita e salva (v1)
  await page.click("#mtFicha [data-addex=\"0\"]");
  await page.waitForTimeout(400);
  const row = page.locator('#mtFicha .mt-day[data-day="0"] .mt-row').last();
  await row.locator(".mt-name").fill("Cadeira flexora");
  await row.locator(".mt-sets").fill("3");
  await page.waitForTimeout(600);
  await page.click("#mtSalvar");
  await page.waitForTimeout(900);
  // edita e salva de novo (v2)
  await page.click("#mtFicha [data-addex=\"0\"]");
  await page.waitForTimeout(400);
  const row2 = page.locator('#mtFicha .mt-day[data-day="0"] .mt-row').last();
  await row2.locator(".mt-name").fill("Mesa flexora");
  await page.waitForTimeout(600);
  await page.click("#mtSalvar");
  await page.waitForTimeout(900);

  st = await S();
  const hist = (st.planHist && st.planHist.ariana) || [];
  ok("histórico guardou versões", hist.length >= 2, hist.length + " versão(ões)");
  ok("versão mais recente tem Mesa flexora", hist[0] && hist[0].days[0].items.some(i => /Mesa flexora/.test(i)),
     (hist[0] ? hist[0].days[0].items.length + " itens: " + hist[0].days[0].items.join(" || ").slice(0, 160) : "sem versão"));

  await page.click("#mtHistorico");
  await page.waitForTimeout(500);
  ok("modal de versões abre", await page.isVisible("#planHistModal .modal-box"));
  const linhas = await page.$$eval("#planHistBody .hist-item", els => els.length);
  ok("lista mostra as versões", linhas >= 2, linhas + " linha(s)");
  await page.click('#planHistBody [data-hist="1"]');
  await page.waitForTimeout(1200);
  st = await S();
  const itens = st.plans.ariana.days[0].items;
  ok("restaurar trouxe a versão anterior", !itens.some(i => /Mesa flexora/.test(i)), itens.length + " itens");

  // ---------- 4. persistência ----------
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  st = await S();
  ok("versões persistem após recarregar", (((st.planHist || {}).ariana) || []).length >= 2);
  ok("sem erro de console", erros.length === 0, erros.slice(0, 3).join(" | "));

  console.log("\n=== DESFAZER + VERSÕES ===");
  R.forEach(([s, n, e]) => console.log(`${s} ${n}${e ? "  →  " + e : ""}`));
  const f = R.filter(r => r[0] === "FALHA").length;
  console.log(`\n${R.length - f}/${R.length} verificações OK`);
  await browser.close();
  process.exit(f ? 1 : 0);
})();
