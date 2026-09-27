# Money Until Payday

A mobile-first, installable paycheque planner and discretionary spending tracker. Static HTML, CSS and JavaScript; no build step, subscription, login, or bank connection. All data is saved locally in this browser. Amounts use Canadian dollars.

## Test locally

1. Extract the ZIP, open a terminal in the `money-until-payday` folder.
2. Run `python -m http.server 8000` (or `python3 -m http.server 8000`).
3. Visit `http://localhost:8000` in Chrome or Edge. Start a pay period with today's date, a future payday, the full paycheque, and a discretionary allowance. Add a must pay, a debt payment, a savings transfer, and a purchase. Edit and delete entries; refresh to confirm persistence. Export a JSON backup and test restore. Download both CSV files for Excel.
4. In DevTools > Application > Service Workers, wait until the worker is activated. Reload once, switch DevTools Network to Offline, and reload again. The app should still work. Service workers require `localhost` or HTTPS; opening `index.html` directly as a file will not test installation or offline use.

## Deploy free with GitHub Pages

1. Create a GitHub repository, for example `money-until-payday`. Commit **the contents of this folder at the repository root** (`index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `service-worker.js`, `icons/`, `README.md`). Do not commit the parent folder as an extra layer.
2. In the repository, open **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/(root)**, then save.
3. Open the HTTPS URL GitHub Pages gives you (usually `https://USERNAME.github.io/money-until-payday/`). The app uses relative paths, so repository subpaths work.
4. On Android, open the URL in Chrome, use the browser menu > **Install app** or **Add to Home screen**. Load the page once while online before testing offline.

GitHub Pages serves these files publicly. The app itself contains no personal transactions in the repository; those stay in your device's browser storage. Do not commit exported JSON or CSV files to the repository. GitHub Pages availability and browser install menu wording may change.

## Using the app

- Enter the full pay amount received each payday and choose a discretionary allowance (no preset for new users). Add must pays with an amount and reason, debt payments with an amount and debt name, and savings transfers with an amount and destination. Each can be edited or deleted. You can also edit the pay amount if it changes.
- The paycheque plan includes a pie chart of must pays, debt, savings, the discretionary allowance, and unallocated money. When assignments exceed pay, the pie shows their relative shares and labels the amount overallocated. The paycheque plan shows **unallocated = full pay − must pays − debt payments − savings transfers − the full discretionary allowance**. It is unassigned money, not an increase to the discretionary limit. Purchases are paid out of the allowance already set aside and do not reduce unallocated again. Negative unallocated means planned amounts exceed the entered pay. These entries are records, not proof that a bill was paid or money was transferred.
- The discretionary allowance bar fills red as purchases use it; the adjacent text shows the exact amount left or over budget.
- Safe Today is the nonnegative remaining allowance divided by calendar days until payday; when payday arrives it uses one day until you close the period. Money does not roll over automatically.
- Use Daily check-in to confirm a day’s purchases are all logged (blue). Completed past days with no discretionary spending receive the no-spending status automatically (gold); today remains pending until it is complete. Tap a day tile to select it. Adding or editing a purchase on a checked day clears that day’s confirmation so you can check it again. Unchecked and future days remain neutral. The strip spans the actual pay period, normally 14 days.
- Use What if I buy something? to preview the effect of a purchase without recording it. From the preview you may open the normal purchase form with the amount prefilled. Close a period to see a payday recap with check-ins, amount left or over, debt payments, and savings transfers, then archive it and start another. History retains the check-in summary and category totals. Optionally set a default allowance and payday interval in Settings. Leaving the default allowance blank asks for a value each payday. Existing users keep their saved settings and categories; new users start with general categories.
- **Back up regularly:** Settings > Download JSON backup. Restoring a backup **replaces** existing data on that browser. Two CSV exports include purchases and must-pay/debt/savings entries across all periods, for Excel; they do not include settings or no-spend marks. JSON is the complete backup. Existing V1 and V2 browser data and JSON backups are migrated automatically; older periods show “Pay amount missing” until you enter the original pay amount, if available.
- Browser data is device and browser specific. Clearing site data or changing phones without restoring a backup loses the records. The app has no account or sync.

## Current feature notes

- Recurring must-pay presets are managed from **Debts** and enabled presets are copied once when a new pay period starts.
- The Debts view tracks balances and debt allocations; debt payments reduce the tracked current balance.
- Daily check-in dates are selected from the two-week grid. **All purchases logged** remains available for purchase days, while days with no discretionary purchases receive a no-spending status automatically.
- The complete engineering context is in [HANDOFF_PACKAGE.md](HANDOFF_PACKAGE.md).

## Project files

`index.html` interface; `styles.css` responsive styles; `app.js` local data, allocation records, and calculations; `manifest.webmanifest` install metadata; `service-worker.js` offline shell cache; `icons/` install icons. To publish a code update, change the cache name in `service-worker.js` so installed copies refresh their offline shell.
