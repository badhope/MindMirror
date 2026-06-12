import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('requestfailed', r => console.log('FAILED:', r.url(), r.failure()?.errorText));
page.on('response', r => { if (r.status() >= 400) console.log('HTTP', r.status(), r.url()); });
await page.goto('http://127.0.0.1:4173/MindMirror/');
await page.waitForTimeout(2000);
await browser.close();
