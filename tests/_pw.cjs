/* Playwright portátil: usa o pacote local (CI) ou o global do sandbox; e acha o Chromium. */
const fs = require("fs");
let chromium;
try { ({ chromium } = require("playwright")); }
catch (e) { ({ chromium } = require("/home/user/.npm-global/lib/node_modules/playwright/index.js")); }

const CANDIDATES = [
  "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
];
const exe = process.env.PW_CHROME || CANDIDATES.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });

function launch() {
  const opts = { args: ["--no-sandbox", "--disable-dev-shm-usage"] };
  if (exe) opts.executablePath = exe;
  return chromium.launch(opts);
}
module.exports = { chromium, launch };
