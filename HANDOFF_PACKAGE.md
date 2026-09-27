# Money Until Payday: Current Handoff Package

## Purpose

This document is the complete context for a new coding session working on this repository. Continue the existing app; do not rebuild it or migrate frameworks.

## Project

- App: Money Until Payday
- Stack: static HTML, CSS, and vanilla JavaScript
- Runtime: browser-only, mobile-first, Android-oriented PWA
- Persistence: `localStorage` under `money-until-payday-v1`
- Offline support: `service-worker.js` and `manifest.webmanifest`
- No backend, login, account, bank connection, build step, or framework
- Local development: `python -m http.server 8000`, then open `http://localhost:8000`

## Important Files

- `index.html`: app shell, views, navigation, and baseline dialogs
- `app.js`: state model, migration/validation, rendering, event handlers, persistence, exports, check-ins, recurring presets, and debt tracking
- `styles.css`: responsive mobile-first visual system and overflow protections
- `service-worker.js`: offline shell cache; update its cache name when changing cached app files
- `manifest.webmanifest`: install metadata
- `README.md`: user/deployment notes
- `icons/`: PWA icons

## Current Features

The existing workflow must remain intact:

- Start and close pay periods
- Enter full paycheque and discretionary allowance
- Record, edit, delete, and preview discretionary purchases
- Record must pays, debt payments, and savings transfers
- Pay-period history and payday recap
- Daily check-in grid, streaks, achievements, and Payday Finisher
- Settings for currency, cadence, and default allowance
- JSON backup/restore and purchase/allocation CSV exports
- Local persistence and offline PWA behavior

## Recurring Must-Pay Presets

Recurring presets are stored in `state.recurringMustPays`.

Each preset has:

- `id`
- `name`
- `amountCents`
- `enabled`
- timestamps

Enabled presets are copied into a newly created pay period by `addRecurringMustPaysForPeriod(period)`. The copied allocation stores `sourcePresetId`, so the preset is not recopied on render or refresh. Presets can be added, edited, toggled, and deleted from the Debts view.

## Debt Tracker

Debts are stored in `state.debts`.

Each debt has:

- `id`
- `name`
- `startingBalanceCents`
- `currentBalanceCents`
- `interestChargeCents`
- `interestCadence`: `monthly`, `per-pay-period`, or `one-time`
- `active`
- timestamps

Debt allocations reference `debtId`. `applyDebtAllocationDelta` adjusts the current balance when a debt allocation is created, edited, moved to another debt, or deleted. The tracker is exposed from the Debts navigation view. The code contains two legacy `debt-list` IDs; the `$` helper routes Home allocation rendering and Debts tracker rendering to the correct container.

## Daily Check-In Behavior

The two-week day grid is the date selector. The visible date input is hidden and retained only as an internal compatibility value.

- Users tap a day tile to select a date.
- The `All purchases logged` action remains available only when the selected day has discretionary purchases.
- The `No spending` action is hidden.
- A day with no discretionary purchases automatically receives the derived `no-spend` status.
- Existing explicit check-in records remain supported for backup compatibility.
- Future days remain neutral/disabled.

When changing this behavior, preserve streak calculations and historical backup validation.

## Data and Compatibility

The state shape is version 6:

```js
{
  version: 6,
  streakBadges: [],
  finishers: [],
  dailyCheckins: [],
  allocations: [],
  settings: {
    defaultAllowanceCents: null,
    paydayCadenceDays: 14,
    currency: 'CAD',
    categories: []
  },
  periods: [],
  transactions: [],
  noSpendDays: [],
  recurringMustPays: [],
  debts: []
}
```

`validateBackup` accepts older formats and normalizes them into version 6. Do not silently mutate historical period totals when changing debt or allocation logic. Amounts are integer cents; user-facing inputs are decimal currency values.

## Visual/Responsive Constraints

The app is intentionally compact and mobile-first. Keep these constraints:

- Preserve the existing dark palette and card-based workflow.
- Do not introduce a framework or redesign the information architecture.
- Long names, notes, labels, buttons, legends, and dialog controls must wrap inside their parents.
- Cards and dialogs must remain within the viewport, including roughly 280px-wide screens.
- Action groups may wrap; do not force horizontal overflow.
- Balance typography uses stable sizes rather than viewport-scaled text.
- Keep inputs and selects at `max-width: 100%`.

## Validation

Run:

```powershell
node --check app.js
```

Also check VS Code diagnostics for `app.js`, `index.html`, and `styles.css`.

Manual smoke test through a local server:

1. Start a pay period.
2. Add a recurring preset and confirm it is copied once into a new period.
3. Add a debt, create/edit/delete a debt payment, and verify the balance changes.
4. Tap day tiles, confirm a purchase day with `All purchases logged`, and confirm a zero-purchase day shows `No spending` automatically.
5. Refresh, export JSON, import it, and verify periods, presets, debts, allocations, purchases, and check-ins remain intact.
6. Test at narrow mobile widths and confirm no horizontal text or control spillover.
7. Test service-worker behavior on `localhost` or HTTPS.

## Known Follow-Up Risks

- `app.js` is heavily compacted/minified-style source. Make small, targeted edits and run `node --check` after each behavior change.
- The visible preset/debt editor dialogs are generated at runtime by `ensureFeatureDialogs`; keep their IDs synchronized with the handlers.
- The service worker cache name must be changed when deploying a code update so installed clients receive the new shell.
- The current Git publish state and remote should be checked before committing; do not commit exported personal JSON or CSV data.

## Collaboration Rules

- Extend the current app instead of rebuilding it.
- Preserve old local data and backup compatibility.
- Prefer the smallest focused change.
- Validate behavior after edits.
- Do not commit secrets or personal exports.
