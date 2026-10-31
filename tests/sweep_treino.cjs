const { launch } = require("./_pw.cjs");
const BASE = process.argv[2] || process.env.BASE || "http://localhost:8910/";
const R = [];
const ok = (n, c, e) => R.push([c ? "OK " : "FALHA", n, e || ""]);

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "pt-BR", acceptDownloads: true });
  const page = await ctx.newPage();
  const erros = [];
  page.on("pageerror", e => erros.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error" && !/rss2json|ERR_FAILED|CORS|net::/.test(m.text())) erros.push(m.text()); });
  page.on("dialog", d => d.accept());

  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    const st = { version: 1, seedApplied: 1, avSeedApplied: 1, auth: { name: "Giovanni", email: "a@b.c", hash: "x" }, activeStudentId: "ariana",
      students: [
        { id: "ariana", name: "Ariana Costa de Faria", goal: "Emagrecimento", level: "Intermediário", tag: "ATIVO", createdAt: "2026-03-01T10:00:00Z" },
        { id: "daniele", name: "Daniele de A. Paula", goal: "Hipertrofia", level: "Iniciante", tag: "ATIVO", createdAt: "2026-05-02T10:00:00Z" }],
      plans: { daniele: { title: "Ficha Dani", days: [{ title: "Treino A", items: ["Leg press — 4×10 (120 kg); 90 s; RIR 2"] }] } },
      sessions: [{ id: "s1", studentId: "ariana", date: "2026-10-20", exercises: [] }],
      assessments: [{ id: "a1", studentId: "ariana", date: "2026-10-01", sex: "F", weight: 72.4, height: 165, measures: { waist: 80 }, folds: { chest: 12, abdominal: 22, thigh: 20, triceps: 18, subscapular: 15, midaxillary: 14, suprailiac: 16 }, photos: { front: [], side: [], back: [] } }],
      group: null, finance: { settings: {}, students: { ariana: { tel: "11987654321", valor: 350, dia: 5, ativo: true, desde: "2026-01" } }, payments: [] },
      portal: {}, agenda: null, alertaDias: 7, newsCache: { at: 0, items: [] } };
    localStorage.setItem("ghPerformance.v1", JSON.stringify(st));
    localStorage.setItem("ghPerformance.authed", "1");
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1600);
  const S = () => page.evaluate(() => JSON.parse(localStorage.getItem("ghPerformance.v1")));

  // ---------- 1. layout / abas internas ----------
  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(700);
  const panes = await page.$$eval("#alunos [data-al-pane]", els => els.map(e => e.dataset.alPane));
  ok("aba Alunos tem 3 painéis", panes.join(",") === "resumo,treino,fin", panes.join(","));
  const info = await page.$$eval("#studentCard .al-info", els => els.map(e => e.textContent.replace(/\s+/g, " ").trim()));
  ok("perfil mostra todas as informações", info.length >= 8, info.length + " blocos: " + info.slice(0, 4).join(" | "));

  // ---------- 2. painel Treino ----------
  await page.click('[data-al-pane="treino"]');
  await page.waitForTimeout(600);
  ok("editor visível", await page.isVisible("#mtFicha"));
  const vazio = await page.textContent("#mtFicha");
  ok("sem ficha mostra orientação", /Nenhuma ficha/i.test(vazio), vazio.trim().slice(0, 50));

  // cria ficha
  await page.click("#mtNovaFicha");
  await page.waitForTimeout(700);
  ok("ficha criada no estado", !!(await S()).plans.ariana, JSON.stringify(Object.keys((await S()).plans)));
  const dias = await page.$$eval("#mtFicha .mt-day", els => els.length);
  ok("editor mostra 1 treino", dias === 1, dias + " dia(s)");

  // adiciona exercício e preenche
  await page.click("#mtFicha [data-addex]");
  await page.waitForTimeout(500);
  const row = page.locator("#mtFicha .mt-row").last();
  await row.locator(".mt-name").fill("Supino reto com barra");
  await row.locator(".mt-sets").fill("4");
  await row.locator(".mt-reps").fill("6-8");
  await row.locator(".mt-load").fill("42,5");
  await row.locator(".mt-rir").fill("2");
  await page.waitForTimeout(900); // autosave (400 ms)
  let st = await S();
  const it = st.plans.ariana.days[0].items[0];
  ok("autosave gravou o exercício", /Supino reto com barra/.test(it || "") && /4×6[-–]8/.test(it || ""), it);

  // ---------- 3. salvar e sincronizar ----------
  await page.click("#mtSalvar");
  await page.waitForTimeout(900);
  st = await S();
  ok("salvar persiste a ficha", st.plans.ariana.days[0].items.length === 1);
  await page.click('.tab[data-page="treino"]');
  await page.waitForTimeout(700);
  const trDias = await page.$$eval("#trDay option", os => os.map(o => o.textContent));
  ok("modo guiado enxerga o treino novo", trDias.length >= 1 && !/Sem ficha/i.test(trDias[0]), trDias.join(" | "));

  // ---------- 4. reparo de dados ----------
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem("ghPerformance.v1"));
    st.plans.ariana.days[0].items.push(st.plans.ariana.days[0].items[0]);                    // duplicado
    st.plans.ariana.days[0].items.push({ name: "Rosca direta", sets: 3, reps: "12", load: 20 }); // objeto antigo
    st.plans.ariana.days[0].items.push("   ");                                               // vazio
    st.plans.ariana.days.push({ title: "", items: "quebrado" });                              // dia corrompido
    localStorage.setItem("ghPerformance.v1", JSON.stringify(st));
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(600);
  await page.click('[data-al-pane="treino"]');
  await page.waitForTimeout(500);
  await page.click("#alReparar");
  await page.waitForTimeout(500);
  ok("modal de reparo abre", await page.isVisible("#fichaModal .modal-box"));
  const antesTxt = await page.textContent("#fichaBody");
  ok("modal aponta atenção", /atenção/i.test(antesTxt), antesTxt.replace(/\s+/g, " ").slice(0, 90));
  await page.click("#fichaRepararAgora");
  await page.waitForTimeout(1200);
  st = await S();
  const items = st.plans.ariana.days[0].items;
  ok("reparo remove duplicado", items.filter(i => /Supino reto/.test(i)).length === 1, items.length + " item(s)");
  ok("reparo converte objeto em texto", items.some(i => /Rosca direta/.test(i) && /3×12/.test(i)), items.join(" || "));
  ok("reparo remove vazio", !items.some(i => !String(i).trim()));
  ok("reparo conserta dia corrompido", Array.isArray(st.plans.ariana.days[1].items), JSON.stringify(st.plans.ariana.days[1]));
  ok("backup do reparo criado", !!st.fichaBkpKey, st.fichaBkpKey || "");

  // desfazer
  await page.click("#alReparar");
  await page.waitForTimeout(400);
  await page.click("#fichaUndo");
  await page.waitForTimeout(900);
  st = await S();
  ok("desfazer restaura o estado anterior", st.plans.ariana.days[0].items.filter(i => /Supino reto/.test(i)).length === 2,
     st.plans.ariana.days[0].items.length + " item(s) após desfazer");

  // ---------- 5. persistência após reload ----------
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(600);
  const paneAtual = await page.$$eval("#alunos [data-al-pane].on", els => els.map(e => e.dataset.alPane));
  ok("lembra o painel ativo", paneAtual[0] === "treino", paneAtual.join(","));
  ok("editor reabre com a ficha", (await page.$$("#mtFicha .mt-day")).length >= 1);

  // ---------- 6. erros ----------
  const tabs = await page.$$eval(".tab[data-page]", els => els.map(e => e.dataset.page));
  for (const t of tabs) { await page.click(`.tab[data-page="${t}"]`); await page.waitForTimeout(300); }
  ok("todas as " + tabs.length + " abas abrem", true, tabs.join(","));
  ok("nenhum erro de console", erros.length === 0, erros.slice(0, 3).join(" | "));

  console.log("\n=== ABA ALUNOS + EDITOR DE TREINO ===");
  R.forEach(([s, n, e]) => console.log(`${s} ${n}${e ? "  →  " + e : ""}`));
  const f = R.filter(r => r[0] === "FALHA").length;
  console.log(`\n${R.length - f}/${R.length} verificações OK`);
  await browser.close();
  process.exit(f ? 1 : 0);
})();
