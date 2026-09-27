const { chromium } = require('playwright');
(async()=>{
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const consoleErrors = [];
const pageErrors = [];
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', error => pageErrors.push({ message: error.message, stack: error.stack }));
await page.goto('http://localhost:8000/', { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.locator('#period-form input[name="startDate"]').fill('2026-09-27');
await page.locator('#period-form input[name="nextPayday"]').fill('2026-10-11');
await page.locator('#period-form input[name="payAmount"]').fill('2500');
await page.locator('#period-form input[name="allowance"]').fill('500');
await page.locator('#period-form button[type="submit"]').click();
await page.locator('[data-view="debts"]').click();
await page.locator('#add-preset').click();
await page.locator('#preset-form input[name="name"]').fill('Rent');
await page.locator('#preset-form input[name="amount"]').fill('900');
await page.locator('#preset-form button[type="submit"]').click();
await page.locator('#add-debt').click();
await page.locator('#debt-form input[name="name"]').fill('Card');
await page.locator('#debt-form input[name="startingBalance"]').fill('1200');
await page.locator('#debt-form input[name="interestCharge"]').fill('0');
await page.locator('#debt-form button[type="submit"]').click();
await page.locator('[data-view="dashboard"]').click();
const state = await page.evaluate(() => ({
  title: document.title,
  dashboardVisible: !document.querySelector('#dashboard').hidden,
  bodyText: document.body.innerText.slice(0, 300),
  navButtons: [...document.querySelectorAll('.nav button')].map(button => ({ text: button.innerText, width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height })),
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  presetDialog: Boolean(document.querySelector('#preset-dialog')),
  debtDialog: Boolean(document.querySelector('#debt-dialog')),
  dayTiles: document.querySelectorAll('#day-grid .day-tile').length,
  currentDayPending: document.querySelector('#day-grid .day-tile.pending') !== null,
  noSpendButtonHidden: document.querySelector('#mark-day').hidden,
  savedPreset: JSON.parse(localStorage.getItem('money-until-payday-v1')).recurringMustPays.length,
  savedDebt: JSON.parse(localStorage.getItem('money-until-payday-v1')).debts.length
}));
await page.screenshot({ path: 'playwright-home.png', fullPage: true });
console.log(JSON.stringify({ state, consoleErrors, pageErrors }, null, 2));
await browser.close();
})();
