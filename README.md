# Tacoma Lifecycle Cost Dashboard

Interactive dashboard for modeling the maintenance cost and projected value of a `2022 Toyota Tacoma V6 SR5 Access Cab, 6' bed` out to `500,000` miles.

## What It Does

- Shows cumulative maintenance cost over time.
- Lets you edit the cost of each maintenance item.
- Models projected Tacoma value as mileage increases.
- Shows the next scheduled maintenance package based on your current mileage.
- Flags when optional maintenance starts to look weak relative to truck value.
- Uses interactive Plotly charts in the browser.

## Files

- `index.html`
  Main dashboard page.
- `app.js`
  Dashboard logic, Plotly charts, lifecycle calculations, value model, and worth-it analysis.
- `styles.css`
  Dashboard styling.
- `itemList.json`
  Source of maintenance item names and default costs.
- `requiredItemsAtIntervals.json`
  Source of required and as-needed maintenance grouped by interval.
- `generate-dashboard-data.mjs`
  Builds the browser-ready data bundle from the two JSON files.
- `dashboard-data.json`
  Generated intermediate data file for the dashboard.
- `dashboard-data.js`
  Generated browser bundle loaded by `index.html`.

## How To Use

1. Open `index.html` in a browser.
2. Enter your current mileage.
3. Adjust the target mileage if you want to inspect a different horizon.
4. Review the `Next maintenance decision` panel for the immediate call.
5. Use the `Cost Inputs` tab to change maintenance costs.

Edits to maintenance costs persist in browser local storage until you reset them.

## How The Model Works

### Maintenance cost model

- The dashboard repeats the populated `0-100k` JSON maintenance schedule across five `100k` cycles.
- `Required` items count toward the required-cost curve.
- `As-needed` items are included in the max-cost curve.

### Tacoma value model

The truck-value model is anchored to:

- Purchase price: `$37,000`
- Purchase timing: `August 2022`
- Current mileage anchor: `75,000`
- Current market date anchor: `March 23, 2026`

The model uses:

- KBB market values
- Edmunds appraisal references
- iSeeCars depreciation / resale references
- An explicit mileage penalty layered on top of an age-based residual curve

This is a decision-support model, not an appraisal.

### Worth-it logic

The dashboard uses simple burden thresholds relative to current truck value:

- Below `5%`: generally reasonable
- `5%` to `10%`: review
- `10%` to `15%`: questionable unless needed
- Above `15%` for optional work: usually not worth doing blindly

Required items are still treated differently from optional items. A required service can be expensive and still be the rational choice if the goal is to keep the truck on the road.

## Regenerating Data

If you change either source JSON file, regenerate the browser bundle:

```powershell
node .\generate-dashboard-data.mjs
```

Then refresh the browser.

## Notes

- Plotly is loaded from its CDN, so the browser needs internet access for charts to render.
- If GitHub push is needed later, GitHub CLI auth must be valid first.

## Sources Used In The Value Model

- [Kelley Blue Book Tacoma values](https://www.kbb.com/toyota/tacoma-access-cab/2022/sr5-pickup-4d-6-ft/)
- [Edmunds Tacoma appraisal values](https://www.edmunds.com/toyota/tacoma/2022/appraisal-value/)
- [iSeeCars Tacoma resale value](https://www.iseecars.com/car/toyota-tacoma/resale-value)
- [iSeeCars Tacoma overview](https://www.iseecars.com/car/toyota-tacoma)
