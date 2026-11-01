// Saves each poster on /poster-sheet as public/posters/<id>-<theme>.webp (dark + light).
// Needs the dev server running and playwright-core with a Chromium:
//   npm run dev
//   npx -y -p playwright-core@1.56.1 node scripts/render-posters.cjs   (set CHROME=/path/to/chrome if needed)
// Then convert the PNGs in ./.posters-tmp to webp (e.g. cwebp -q 88) into public/posters/.
const { chromium } = require("playwright-core");
const fs = require("fs");

(async () => {
  const out = ".posters-tmp";
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  for (const theme of ["dark", "light"]) {
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
    await ctx.addInitScript((t) => localStorage.setItem("ds-theme", t), theme);
    const page = await ctx.newPage();
    await page.goto("http://localhost:3000/poster-sheet", { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    await page.evaluate(() => document.fonts.ready);
    for (const el of await page.$$("[data-poster]")) {
      const id = await el.getAttribute("data-poster");
      await (await el.$(".ds-poster")).screenshot({ path: `${out}/${id}-${theme}.png`, omitBackground: true });
      console.log("saved", id, theme);
    }
    await ctx.close();
  }
  await browser.close();
})();
