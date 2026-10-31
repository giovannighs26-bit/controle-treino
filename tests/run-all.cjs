/* Sobe o app num servidor estático e roda todas as suítes, uma por vez. */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 8123);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".png": "image/png", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".css": "text/css", ".woff2": "font/woff2" };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/" || p.endsWith("/")) p += "index.html";
  const file = path.join(ROOT, p.replace(/^\/+/, ""));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end("not found"); return;
  }
  res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(res);
});

const suites = ["sweep_full.cjs", "sweep_treino.cjs", "sweep_alunos.cjs", "sweep_nomes.cjs", "sweep_undo.cjs"];

server.listen(PORT, async () => {
  const base = `http://localhost:${PORT}/`;
  console.log(`servindo ${ROOT} em ${base}\n`);
  let falhou = 0;
  for (const s of suites) {
    console.log(`\n──────── ${s} ────────`);
    const code = await new Promise(resolve => {
      const ch = spawn("node", [path.join(__dirname, s), base], { stdio: "inherit", env: { ...process.env, BASE: base } });
      ch.on("exit", resolve);
    });
    if (code !== 0) falhou++;
  }
  server.close();
  console.log(`\n${falhou ? "❌ " + falhou + " suíte(s) falharam" : "✅ todas as suítes passaram"}`);
  process.exit(falhou ? 1 : 0);
});
