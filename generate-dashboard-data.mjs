import { readFileSync, writeFileSync } from "node:fs";

const itemList = JSON.parse(readFileSync("itemList.json", "utf8"));
const requiredItemsAtIntervals = JSON.parse(
  readFileSync("requiredItemsAtIntervals.json", "utf8"),
);

const services = Object.entries(itemList)
  .map(([id, item]) => ({
    id: Number(id),
    service: item.service,
    cost: Number(item.estimated_toyota_dealer_cost_usd || 0),
  }))
  .sort((a, b) => a.id - b.id);

const intervals = Object.values(requiredItemsAtIntervals)
  .map((entry) => ({
    intervalK: Number(entry.intervalK),
    required: (entry.required || []).map((item) => ({
      serviceId: Number(item.serviceId),
      service: item.service,
      severity: item.severity,
    })),
    asNeeded: (entry.asNeeded || []).map((item) => ({
      serviceId: Number(item.serviceId),
      service: item.service,
      severity: item.severity,
    })),
  }))
  .sort((a, b) => a.intervalK - b.intervalK);

const dashboardData = {
  generatedAt: new Date().toISOString(),
  assumptions: {
    maxMileage: 500000,
    cycleMileage: 100000,
    cycleRepeatCount: 5,
    extrapolationMethod:
      "Repeat the populated 0-100k JSON maintenance schedule for each additional 100k block through 500k miles.",
  },
  valueModel: {
    vehicle: "2022 Toyota Tacoma V6 SR5 Access Cab 6' bed",
    purchasePrice: 37000,
    purchaseDate: "2022-08-01",
    currentMileage: 75000,
    currentDate: "2026-03-22",
    currentCondition: "Good",
    currentPrivatePartyValue: 21050,
    currentTradeInValue: 18100,
    edmundsTypicalMileageAveragePrivatePartyValue: 27112,
    assumedTypicalMilesPerYear: 12000,
    salvageFloor: 3000,
    ageResidualAnchors: [
      { ageYears: 0, residual: 1 },
      { ageYears: 3, residual: 0.9677041048 },
      { ageYears: 5, residual: 0.8009801072 },
      { ageYears: 7, residual: 0.7110839138 },
      { ageYears: 10, residual: 0.6318567509 }
    ],
    inflectionThresholds: {
      maintenanceToValueCaution: 0.05,
      maintenanceToValueQuestionable: 0.1,
      maintenanceToValueNotWorthIt: 0.15
    },
    sources: [
      {
        name: "Kelley Blue Book 2022 Tacoma Access Cab SR5 6 ft values",
        url: "https://www.kbb.com/toyota/tacoma-access-cab/2022/sr5-pickup-4d-6-ft/"
      },
      {
        name: "Edmunds 2022 Tacoma appraisal values",
        url: "https://www.edmunds.com/toyota/tacoma/2022/appraisal-value/"
      },
      {
        name: "iSeeCars Tacoma depreciation and resale",
        url: "https://www.iseecars.com/car/toyota-tacoma/resale-value"
      },
      {
        name: "iSeeCars Tacoma typical miles driven and lifespan",
        url: "https://www.iseecars.com/car/toyota-tacoma"
      }
    ]
  },
  services,
  intervals,
};

writeFileSync("dashboard-data.json", JSON.stringify(dashboardData, null, 2));
writeFileSync(
  "dashboard-data.js",
  `window.TACOMA_DASHBOARD_DATA = ${JSON.stringify(dashboardData, null, 2)};\n`,
);
