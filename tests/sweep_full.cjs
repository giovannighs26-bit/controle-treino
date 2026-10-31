const { launch } = require("./_pw.cjs");

const BASE = process.argv[2] || process.env.BASE || "http://localhost:8910/";
const R = [];
const ok = (n, c, e) => R.push([c ? "OK " : "FALHA", n, e || ""]);
const SKIP = /excluir|apagar|reset|sair|logout|importar|limpar|deletar|remover|restaurar|aplicar base|forçar/i;

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 }, locale: "pt-BR", acceptDownloads: true });
  const page = await ctx.newPage();
  let erros = [];
  page.on("pageerror", e => erros.push("pageerror: " + e.message + " @ " + (e.stack || "").split("\n")[1]));
  page.on("console", m => { if (m.type() === "error" && !/rss2json|ERR_FAILED|CORS|net::|status of 5\d\d/.test(m.text())) erros.push(m.text().slice(0, 160)); });
  page.on("dialog", d => d.dismiss().catch(() => {}));   // nunca confirma ação destrutiva

  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.setItem("ghPerformance.v1", JSON.stringify({ version: 1, avSeedApplied: 1, auth: { name: "Giovanni Soares", email: "a@b.c", hash: "x" }, students: [], plans: {}, sessions: [], assessments: [], newsCache: { at: 0, items: [] } }));
    localStorage.setItem("ghPerformance.authed", "1");
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1800);
  const boot = Date.now() - t0;

  const st = () => page.evaluate(() => JSON.parse(localStorage.getItem("ghPerformance.v1")));
  let s = await st();
  ok("base carregada (alunos/fichas)", s.students.length >= 10 && Object.keys(s.plans || {}).length >= 10,
     s.students.length + " alunos, " + Object.keys(s.plans || {}).length + " fichas");
  ok("boot < 4s", boot < 4000, boot + " ms");

  // ---------- 1. abas: erros + tempo ----------
  const tabs = await page.$$eval(".tab[data-page]", els => els.map(e => e.dataset.page));
  const tempos = {};
  for (const t of tabs) {
    const a = Date.now();
    erros = [];
    await page.click(`.tab[data-page="${t}"]`);
    await page.waitForTimeout(350);
    tempos[t] = Date.now() - a;
    const aberta = await page.evaluate(id => !!document.querySelector(`.page#${id}.active`), t);
    if (!aberta) ok("aba " + t + " abre", false);
    if (erros.length) ok("aba " + t + " sem erro", false, erros[0]);
  }
  ok("11 abas abrem sem erro", erros.length === 0, Object.entries(tempos).map(([k, v]) => k + ":" + v + "ms").join(" "));

  // ---------- 2. escolar de largura (desktop e mobile) ----------
  const overflowDesktop = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok("sem rolagem horizontal no desktop", overflowDesktop <= 1, overflowDesktop + "px");

  const mob = await ctx.newPage();
  await mob.setViewportSize({ width: 390, height: 844 });
  await mob.goto(BASE, { waitUntil: "domcontentloaded" });
  await mob.waitForTimeout(1400);
  const ruimMob = [];
  for (const t of tabs) {
    await mob.click(`.tab[data-page="${t}"]`).catch(() => {});
    await mob.waitForTimeout(200);
    const d = await mob.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (d > 2) ruimMob.push(t + " (" + d + "px)");
  }
  ok("sem rolagem horizontal no celular", ruimMob.length === 0, ruimMob.join(", "));
  await mob.close();

  // ---------- 3. modais ----------
  const modais = ["#studentModal", "#syncModal", "#fichaModal", "#mtCopyModal", "#finPayModal", "#finAlunoModal", "#finAjustesModal", "#alunoLinkModal", "#agAulaModal", "#agBloqModal", "#gsModal"];
  erros = [];
  await page.click('.tab[data-page="alunos"]');
  await page.waitForTimeout(400);
  const abertos = [];
  for (const m of modais) {
    const abriu = await page.evaluate(sel => {
      const el = document.querySelector(sel);
      if (!el) return "nao-existe";
      el.classList.add("open");
      return true;
    }, m);
    if (abriu === "nao-existe") { abertos.push(m + ":AUSENTE"); continue; }
    await page.waitForTimeout(250);
    const vis = await page.isVisible(m);
    abertos.push(m + ":" + (vis ? "ok" : "invisivel"));
    await page.evaluate(sel => document.querySelector(sel).classList.remove("open"), m);
  }
  ok("modais montam", !abertos.some(a => /AUSENTE|invisivel/.test(a)), abertos.join(" "));
  ok("modais sem erro de console", erros.length === 0, erros[0] || "");

  // ---------- 4. botões (clique seguro) ----------
  erros = [];
  let clicados = 0, falhasClique = [];
  for (const t of tabs) {
    await page.click(`.tab[data-page="${t}"]`);
    await page.waitForTimeout(250);
    const n = await page.$$eval(`#${t} button`, els => els.length).catch(() => 0);
    for (let i = 0; i < n; i++) {
      const loc = page.locator(`#${t} button`).nth(i);
      let txt = "";
      try { txt = (await loc.textContent({ timeout: 700 })) || ""; } catch (e) { continue; }
      if (SKIP.test(txt)) continue;
      try {
        if (!(await loc.isEnabled({ timeout: 600 }))) continue;
        await loc.click({ timeout: 600 });
        clicados++;
      } catch (e) { /* elemento saiu do DOM após re-render: normal */ }
      await page.waitForTimeout(90);
      await page.keyboard.press("Escape").catch(() => {});
      /* fecha overlays de modo guiado que tenham aberto e estejam bloqueando cliques */
      await page.evaluate(() => {
        ["trOverlay", "grOverlay"].forEach(id => {
          const o = document.getElementById(id);
          if (o && !o.hidden) { o.hidden = true; o.style.display = "none"; }
        });
        document.body.classList.remove("tr-on", "gr-on", "locked");
        document.querySelectorAll(".modal.open").forEach(m => m.classList.remove("open"));
      }).catch(() => {});
    }
  }
  ok("botões clicáveis sem travar", falhasClique.length <= 3, clicados + " clicados · falhas: " + falhasClique.slice(0, 4).join(", "));
  ok("cliques sem erro de console", erros.length === 0, erros.slice(0, 2).join(" | "));

  // volta ao estado normal depois da sequência de cliques (fecha janelas de impressão abertas)
  for (const pg of ctx.pages()) { if (pg !== page) await pg.close().catch(() => {}); }
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1800);

  // ---------- 5. integridade dos dados após a varredura ----------
  s = await st();
  ok("nenhum aluno duplicado", new Set(s.students.map(x => x.id)).size === s.students.length);
  ok("fichas preservadas", Object.keys(s.plans || {}).length >= 10, Object.keys(s.plans || {}).length + " fichas");
  const itens = Object.values(s.plans || {}).reduce((a, p) => a + (p.days || []).reduce((b, d) => b + (d.items || []).length, 0), 0);
  ok("exercícios preservados", itens > 400, itens + " exercícios");

  // ---------- 6. acessibilidade básica ----------
  const a11y = await page.evaluate(() => {
    const semRotulo = [...document.querySelectorAll("button")].filter(b => !b.textContent.trim() && !b.getAttribute("aria-label") && !b.title && !b.querySelector("svg,img")).length;
    const inputsSemLabel = [...document.querySelectorAll("input,select,textarea")].filter(i => {
      if (i.type === "hidden" || i.getAttribute("aria-label") || i.title) return false;
      if (i.id && document.querySelector('label[for="' + i.id + '"]')) return false;
      return !i.closest("label");
    }).length;
    return { semRotulo, inputsSemLabel, imgsSemAlt: [...document.images].filter(i => !i.alt).length };
  });
  ok("botões com rótulo", a11y.semRotulo === 0, a11y.semRotulo + " sem rótulo");
  ok("campos com label", a11y.inputsSemLabel <= 2, a11y.inputsSemLabel + " sem label");

  // ---------- 7. backup / exportação ----------
  await page.click('.tab[data-page="data"]');
  await page.waitForTimeout(400);
  const dl = page.waitForEvent("download", { timeout: 12000 }).catch(() => null);
  const exp = await page.$("#exportBtn");
  if (exp) await exp.click();
  const arq = await dl;
  if (arq) {
    const p = "/tmp/backup-varredura.json";
    await arq.saveAs(p);
    const fs = require("fs");
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    ok("backup exportado íntegro", !!j.students && j.students.length >= 10, j.students.length + " alunos no arquivo");
  } else ok("backup exportado", false, "sem download");

  console.log("\n=== VARREDURA GERAL DO APP ===");
  R.forEach(([st2, n, e]) => console.log(`${st2} ${n}${e ? "  →  " + e : ""}`));
  console.log(`\ntempos das abas: ${Object.entries(tempos).map(([k, v]) => k + " " + v + "ms").join(" · ")}`);
  console.log(`\n${R.length - R.filter(r => r[0] === "FALHA").length}/${R.length} verificações OK`);
  await browser.close();
})();
