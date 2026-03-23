(() => {
  const STORAGE_KEY = "tacoma-lifecycle-cost-overrides-v3";
  const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

  const CONDITION_MULTIPLIERS = {
    fair: 0.9335,
    good: 1,
    veryGood: 1.0285,
    excellent: 1.0523,
  };

  const state = {
    data: null,
    costOverrides: {},
    targetMileage: 500000,
    viewMode: "required",
    conditionMode: "good",
    currentMileage: 75000,
  };

  let elements;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }

  function initialize() {
    state.data = window.TACOMA_DASHBOARD_DATA;
    elements = {
      assumptionText: document.querySelector("#assumptionText"),
      targetMileage: document.querySelector("#targetMileage"),
      targetMileageValue: document.querySelector("#targetMileageValue"),
      currentMileageInput: document.querySelector("#currentMileageInput"),
      viewMode: document.querySelector("#viewMode"),
      conditionMode: document.querySelector("#conditionMode"),
      requiredTotal: document.querySelector("#requiredTotal"),
      maxTotal: document.querySelector("#maxTotal"),
      avgPer10k: document.querySelector("#avgPer10k"),
      eventCount: document.querySelector("#eventCount"),
      projectedValue: document.querySelector("#projectedValue"),
      maintenanceValueRatio: document.querySelector("#maintenanceValueRatio"),
      currentValueAnchor: document.querySelector("#currentValueAnchor"),
      currentTradeAnchor: document.querySelector("#currentTradeAnchor"),
      mileagePenalty: document.querySelector("#mileagePenalty"),
      valueAt500k: document.querySelector("#valueAt500k"),
      valueModelSummary: document.querySelector("#valueModelSummary"),
      worthItCall: document.querySelector("#worthItCall"),
      worthItSubtext: document.querySelector("#worthItSubtext"),
      liveCurrentValue: document.querySelector("#liveCurrentValue"),
      nextIntervalMileage: document.querySelector("#nextIntervalMileage"),
      nextRequiredCost: document.querySelector("#nextRequiredCost"),
      nextMaxCost: document.querySelector("#nextMaxCost"),
      nextRequiredPct: document.querySelector("#nextRequiredPct"),
      nextMaxPct: document.querySelector("#nextMaxPct"),
      nextRequiredItems: document.querySelector("#nextRequiredItems"),
      nextOptionalItems: document.querySelector("#nextOptionalItems"),
      lineChart: document.querySelector("#lineChart"),
      serviceBars: document.querySelector("#serviceBars"),
      valueChart: document.querySelector("#valueChart"),
      timelineBody: document.querySelector("#timelineBody"),
      inflectionBody: document.querySelector("#inflectionBody"),
      costTableBody: document.querySelector("#costTableBody"),
      sourcesList: document.querySelector("#sourcesList"),
      resetCosts: document.querySelector("#resetCosts"),
      tabButtons: [...document.querySelectorAll(".tab-button")],
      tabPanels: [...document.querySelectorAll(".tab-panel")],
    };

    if (!state.data || !window.Plotly) {
      document.body.insertAdjacentHTML(
        "afterbegin",
        '<div style="margin:16px;padding:16px;border:1px solid #b44;background:#fff4f4;color:#611;">Dashboard failed to load. Check that <code>dashboard-data.js</code> is present and that your browser can load Plotly from the internet.</div>',
      );
      return;
    }

    state.costOverrides = loadOverrides();
    state.targetMileage = Number(elements.targetMileage.value);
    state.viewMode = elements.viewMode.value;
    state.conditionMode = elements.conditionMode.value;
    state.currentMileage = Number(elements.currentMileageInput.value);

    attachEvents();
    render();
  }

  function attachEvents() {
    elements.targetMileage.addEventListener("input", (event) => {
      state.targetMileage = Number(event.target.value);
      render();
    });

    elements.viewMode.addEventListener("change", (event) => {
      state.viewMode = event.target.value;
      render();
    });

    elements.currentMileageInput.addEventListener("input", (event) => {
      state.currentMileage = Math.max(0, Math.min(500000, Number(event.target.value) || 0));
      render();
    });

    elements.conditionMode.addEventListener("change", (event) => {
      state.conditionMode = event.target.value;
      render();
    });

    elements.resetCosts.addEventListener("click", () => {
      state.costOverrides = {};
      localStorage.removeItem(STORAGE_KEY);
      render();
    });

    for (const button of elements.tabButtons) {
      button.addEventListener("click", () => {
        const tab = button.dataset.tab;
        for (const candidate of elements.tabButtons) {
          candidate.classList.toggle("active", candidate === button);
        }
        for (const panel of elements.tabPanels) {
          panel.classList.toggle("active", panel.dataset.panel === tab);
        }
      });
    }
  }

  function render() {
    const model = buildLifecycleModel();
    const valueModel = buildTruckValueModel(model.timeline);
    const nextPackage = buildNextMaintenanceDecision(model.timeline, valueModel);

    elements.assumptionText.textContent = `${state.data.assumptions.extrapolationMethod} Value model uses KBB/Edmunds/iSeeCars anchors plus an explicit mileage penalty.`;
    elements.targetMileageValue.textContent = formatMileage(state.targetMileage);
    elements.requiredTotal.textContent = formatMoney(model.requiredTotal);
    elements.maxTotal.textContent = formatMoney(model.maxTotal);
    elements.avgPer10k.textContent = formatMoney(model.averagePer10k);
    elements.eventCount.textContent = model.timeline.length.toLocaleString();
    elements.projectedValue.textContent = formatMoney(valueModel.selectedProjectedValue);
    elements.maintenanceValueRatio.textContent = `${(valueModel.selectedMaintenanceToValueRatio * 100).toFixed(1)}%`;
    elements.currentValueAnchor.textContent = formatMoney(valueModel.currentPrivateValue);
    elements.currentTradeAnchor.textContent = formatMoney(valueModel.currentTradeValue);
    elements.mileagePenalty.textContent = `${(valueModel.currentMileagePenalty * 100).toFixed(1)}% of same-age typical-mile value`;
    elements.valueAt500k.textContent = formatMoney(valueModel.valueAt500k);
    elements.valueModelSummary.textContent = `${state.data.valueModel.vehicle}. Baseline purchase price ${formatMoney(state.data.valueModel.purchasePrice)} in August 2022, with a modeled current private-party value anchored at ${formatMoney(valueModel.currentPrivateValue)} at ${formatMileage(state.currentMileage)} in ${titleCase(state.conditionMode)} condition.`;
    renderNextMaintenanceDecision(nextPackage);

    renderLifecycleChart(model.timeline);
    renderServiceBars(model.serviceTotals);
    renderValueChart(model.timeline, valueModel.timelineValues);
    renderTimeline(model.timeline, valueModel.valueByMileage);
    renderInflectionTable(model.timeline, valueModel.valueByMileage);
    renderCostTable(model.serviceUsage, valueModel.valueByMileage);
    renderSources();
  }

  function buildLifecycleModel() {
    const serviceMap = new Map(
      state.data.services.map((service) => [
        service.id,
        {
          ...service,
          activeCost: getServiceCost(service.id, service.cost),
          usageCount: 0,
          requiredCount: 0,
          asNeededCount: 0,
        },
      ]),
    );

    const timeline = [];
    const cycleMileage = state.data.assumptions.cycleMileage;
    const cycleCount = Math.ceil(state.targetMileage / cycleMileage);
    let runningRequired = 0;
    let runningMax = 0;

    for (let cycleIndex = 0; cycleIndex < cycleCount; cycleIndex += 1) {
      for (const interval of state.data.intervals) {
        const absoluteMileage = cycleIndex * cycleMileage + interval.intervalK * 1000;
        if (absoluteMileage <= 0 || absoluteMileage > state.targetMileage) {
          continue;
        }

        const intervalEntry = {
          mileage: absoluteMileage,
          cycleNumber: cycleIndex + 1,
          requiredItems: [],
          asNeededItems: [],
          requiredCost: 0,
          maxCost: 0,
          runningRequired: 0,
          runningMax: 0,
        };

        for (const item of interval.required) {
          const service = serviceMap.get(item.serviceId);
          if (!service) {
            continue;
          }
          const actualCost = service.activeCost;
          service.usageCount += 1;
          service.requiredCount += 1;
          intervalEntry.requiredItems.push({ ...item, cost: actualCost });
          intervalEntry.requiredCost += actualCost;
          intervalEntry.maxCost += actualCost;
        }

        for (const item of interval.asNeeded) {
          const service = serviceMap.get(item.serviceId);
          if (!service) {
            continue;
          }
          const actualCost = service.activeCost;
          service.usageCount += 1;
          service.asNeededCount += 1;
          intervalEntry.asNeededItems.push({ ...item, cost: actualCost });
          intervalEntry.maxCost += actualCost;
        }

        runningRequired += intervalEntry.requiredCost;
        runningMax += intervalEntry.maxCost;
        intervalEntry.runningRequired = runningRequired;
        intervalEntry.runningMax = runningMax;
        timeline.push(intervalEntry);
      }
    }

    const serviceTotals = [...serviceMap.values()]
      .map((service) => ({
        ...service,
        totalCost:
          service.activeCost *
          (state.viewMode === "required"
            ? service.requiredCount
            : service.requiredCount + service.asNeededCount),
      }))
      .filter((service) => service.totalCost > 0)
      .sort((a, b) => b.totalCost - a.totalCost);

    const selectedTotal = state.viewMode === "required" ? runningRequired : runningMax;

    return {
      timeline,
      serviceUsage: [...serviceMap.values()].sort((a, b) => a.id - b.id),
      serviceTotals,
      requiredTotal: runningRequired,
      maxTotal: runningMax,
      averagePer10k: selectedTotal / (state.targetMileage / 10000),
    };
  }

  function buildTruckValueModel(timeline) {
    const config = state.data.valueModel;
    const purchaseDate = new Date(`${config.purchaseDate}T00:00:00`);
    const currentDate = new Date(`${config.currentDate}T00:00:00`);
    const baselineCurrentAgeYears = (currentDate - purchaseDate) / MS_PER_YEAR;
    const observedMilesPerYear = estimateMilesPerYear(config.currentMileage, baselineCurrentAgeYears);
    const baselineAgeOnlyCurrentValue =
      config.purchasePrice * interpolateAgeResidual(baselineCurrentAgeYears, config.ageResidualAnchors);
    const trimMarketFactor =
      config.edmundsTypicalMileageAveragePrivatePartyValue / baselineAgeOnlyCurrentValue;
    const conditionMultiplier = CONDITION_MULTIPLIERS[state.conditionMode];
    const baselineAdjustedPrivateValue = config.currentPrivatePartyValue * conditionMultiplier;
    const baselineTypicalAgeValue =
      config.purchasePrice *
      interpolateAgeResidual(baselineCurrentAgeYears, config.ageResidualAnchors) *
      trimMarketFactor;
    const baselineTypicalMiles = config.assumedTypicalMilesPerYear * baselineCurrentAgeYears;
    const baselineExcessMiles = Math.max(0, config.currentMileage - baselineTypicalMiles);
    const baselinePenalty =
      baselineAdjustedPrivateValue / baselineTypicalAgeValue;
    const perMilePenaltyRate =
      baselineExcessMiles > 0 ? -Math.log(baselinePenalty) / baselineExcessMiles : 0;
    const currentAgeYears =
      baselineCurrentAgeYears + (state.currentMileage - config.currentMileage) / observedMilesPerYear;
    const currentPrivateValue = projectTruckValue({
      mileage: state.currentMileage,
      ageYears: currentAgeYears,
      config,
      trimMarketFactor,
      perMilePenaltyRate,
    });
    const currentAgeOnlyValue =
      config.purchasePrice * interpolateAgeResidual(currentAgeYears, config.ageResidualAnchors);
    const currentMileagePenalty =
      currentPrivateValue / (currentAgeOnlyValue * trimMarketFactor);

    const valueByMileage = new Map();
    const timelineValues = [];

    valueByMileage.set(0, config.purchasePrice);

    for (const entry of timeline) {
      const ageYears = currentAgeYears + (entry.mileage - state.currentMileage) / observedMilesPerYear;
      const truckValue = projectTruckValue({
        mileage: entry.mileage,
        ageYears,
        config,
        trimMarketFactor,
        perMilePenaltyRate,
      });
      valueByMileage.set(entry.mileage, truckValue);
      timelineValues.push({
        mileage: entry.mileage,
        projectedValue: truckValue,
      });
    }

    const selectedProjectedValue = valueByMileage.get(state.targetMileage) || timelineValues[timelineValues.length - 1]?.projectedValue || currentPrivateValue;
    const selectedMaintenance =
      state.viewMode === "required"
        ? timeline[timeline.length - 1]?.runningRequired || 0
        : timeline[timeline.length - 1]?.runningMax || 0;

    return {
      currentPrivateValue,
      currentTradeValue: currentPrivateValue * (config.currentTradeInValue / config.currentPrivatePartyValue),
      currentMileagePenalty,
      valueByMileage,
      timelineValues,
      selectedProjectedValue,
      selectedMaintenanceToValueRatio: selectedProjectedValue > 0 ? selectedMaintenance / selectedProjectedValue : 0,
      valueAt500k: timelineValues[timelineValues.length - 1]?.projectedValue || config.salvageFloor,
    };
  }

  function buildNextMaintenanceDecision(timeline, valueModel) {
    const nextEntry =
      timeline.find((entry) => entry.mileage >= state.currentMileage) ||
      timeline[timeline.length - 1];
    const truckValueNow = valueModel.currentPrivateValue;
    const requiredPct = truckValueNow > 0 ? nextEntry.requiredCost / truckValueNow : Infinity;
    const maxPct = truckValueNow > 0 ? nextEntry.maxCost / truckValueNow : Infinity;
    const thresholds = state.data.valueModel.inflectionThresholds;

    let call = "Worth doing";
    let subtext = "Required package cost is a modest percentage of current truck value.";

    if (requiredPct >= thresholds.maintenanceToValueQuestionable) {
      call = "High-cost but still worth doing";
      subtext = "This is expensive relative to truck value, but the required portion is still a normal keep-the-truck-alive expense.";
    } else if (maxPct >= thresholds.maintenanceToValueQuestionable && nextEntry.asNeededItems.length > 0) {
      call = "Do required, scrutinize optional";
      subtext = "The required work looks fine, but some optional items are large enough to review one by one.";
    }

    if (
      nextEntry.asNeededItems.length > 0 &&
      maxPct >= thresholds.maintenanceToValueNotWorthIt
    ) {
      call = "Skip some optional work unless symptoms exist";
      subtext = "The full package is too large a share of truck value to approve blindly. Do the required items first and justify optional ones separately.";
    }

    return {
      nextEntry,
      truckValueNow,
      requiredPct,
      maxPct,
      call,
      subtext,
    };
  }

  function estimateMilesPerYear(currentMileage, currentAgeYears) {
    return currentMileage / Math.max(currentAgeYears, 1);
  }

  function projectTruckValue({ mileage, ageYears, config, trimMarketFactor, perMilePenaltyRate }) {
    const ageResidual = interpolateAgeResidual(ageYears, config.ageResidualAnchors);
    const typicalMiles = config.assumedTypicalMilesPerYear * ageYears;
    const excessMiles = Math.max(0, mileage - typicalMiles);
    const mileagePenalty = Math.exp(-perMilePenaltyRate * excessMiles);
    const rawValue = config.purchasePrice * ageResidual * trimMarketFactor * mileagePenalty;
    return Math.max(config.salvageFloor, rawValue);
  }

  function interpolateAgeResidual(ageYears, anchors) {
    if (ageYears <= anchors[0].ageYears) {
      return anchors[0].residual;
    }

    for (let index = 1; index < anchors.length; index += 1) {
      const previous = anchors[index - 1];
      const current = anchors[index];
      if (ageYears <= current.ageYears) {
        const span = current.ageYears - previous.ageYears;
        const ratio = (ageYears - previous.ageYears) / span;
        const previousLog = Math.log(previous.residual);
        const currentLog = Math.log(current.residual);
        return Math.exp(previousLog + (currentLog - previousLog) * ratio);
      }
    }

    const last = anchors[anchors.length - 1];
    const prior = anchors[anchors.length - 2];
    const annualDecay = Math.log(last.residual / prior.residual) / (last.ageYears - prior.ageYears);
    return Math.exp(Math.log(last.residual) + annualDecay * (ageYears - last.ageYears));
  }

  function renderLifecycleChart(timeline) {
    const layout = basePlotLayout("Mileage", "USD");
    Plotly.react(
      elements.lineChart,
      [
        {
          x: timeline.map((item) => item.mileage),
          y: timeline.map((item) => item.runningRequired),
          name: "Required cumulative cost",
          type: "scatter",
          mode: "lines",
          line: { color: "#8b3f1f", width: 3 },
        },
        {
          x: timeline.map((item) => item.mileage),
          y: timeline.map((item) => item.runningMax),
          name: "Max cumulative cost",
          type: "scatter",
          mode: "lines",
          line: { color: "#1f6f78", width: 3 },
          fill: "tonexty",
          fillcolor: "rgba(31,111,120,0.08)",
        },
      ],
      {
        ...layout,
        margin: { l: 70, r: 20, t: 10, b: 55 },
      },
      { responsive: true, displayModeBar: false },
    );
  }

  function renderServiceBars(serviceTotals) {
    const topServices = serviceTotals.slice(0, 10).reverse();
    Plotly.react(
      elements.serviceBars,
      [
        {
          x: topServices.map((item) => item.totalCost),
          y: topServices.map((item) => item.service),
          type: "bar",
          orientation: "h",
          marker: {
            color: topServices.map((_, index) => `rgba(139,63,31,${0.35 + index * 0.05})`),
          },
          hovertemplate: "%{y}<br>$%{x:,.0f}<extra></extra>",
        },
      ],
      {
        ...basePlotLayout("Total maintenance cost", ""),
        margin: { l: 190, r: 20, t: 10, b: 45 },
        xaxis: { tickprefix: "$", gridcolor: "rgba(31,42,43,0.08)" },
        yaxis: { automargin: true },
      },
      { responsive: true, displayModeBar: false },
    );
  }

  function renderValueChart(timeline, timelineValues) {
    Plotly.react(
      elements.valueChart,
      [
        {
          x: timelineValues.map((item) => item.mileage),
          y: timelineValues.map((item) => item.projectedValue),
          name: "Projected Tacoma value",
          type: "scatter",
          mode: "lines",
          line: { color: "#c68a2e", width: 3 },
        },
        {
          x: timeline.map((item) => item.mileage),
          y: timeline.map((item) => item.runningRequired),
          name: "Required cumulative cost",
          type: "scatter",
          mode: "lines",
          line: { color: "#8b3f1f", width: 2 },
        },
        {
          x: timeline.map((item) => item.mileage),
          y: timeline.map((item) => item.runningMax),
          name: "Max cumulative cost",
          type: "scatter",
          mode: "lines",
          line: { color: "#1f6f78", width: 2, dash: "dot" },
        },
      ],
      {
        ...basePlotLayout("Mileage", "USD"),
        margin: { l: 70, r: 20, t: 10, b: 55 },
      },
      { responsive: true, displayModeBar: false },
    );
  }

  function renderNextMaintenanceDecision(decision) {
    elements.worthItCall.textContent = decision.call;
    elements.worthItSubtext.textContent = decision.subtext;
    elements.liveCurrentValue.textContent = formatMoney(decision.truckValueNow);
    elements.nextIntervalMileage.textContent = formatMileage(decision.nextEntry.mileage);
    elements.nextRequiredCost.textContent = formatMoney(decision.nextEntry.requiredCost);
    elements.nextMaxCost.textContent = formatMoney(decision.nextEntry.maxCost);
    elements.nextRequiredPct.textContent = formatPercent(decision.requiredPct);
    elements.nextMaxPct.textContent = formatPercent(decision.maxPct);
    elements.nextRequiredItems.innerHTML = renderPills(decision.nextEntry.requiredItems);
    elements.nextOptionalItems.innerHTML = renderPills(decision.nextEntry.asNeededItems);
  }

  function renderTimeline(timeline, valueByMileage) {
    elements.timelineBody.innerHTML = timeline
      .map(
        (entry) => `
          <tr>
            <td>${formatMileage(entry.mileage)}</td>
            <td>${entry.cycleNumber}</td>
            <td>${renderPills(entry.requiredItems)}</td>
            <td>${renderPills(entry.asNeededItems)}</td>
            <td>${formatMoney(entry.requiredCost)}</td>
            <td>${formatMoney(entry.maxCost)}</td>
          </tr>
        `,
      )
      .join("");

    const selectedValue = valueByMileage.get(state.targetMileage);
    if (selectedValue) {
      elements.projectedValue.textContent = formatMoney(selectedValue);
    }
  }

  function renderInflectionTable(timeline, valueByMileage) {
    const thresholds = state.data.valueModel.inflectionThresholds;
    const services = new Map();

    for (const entry of timeline) {
      const truckValue = valueByMileage.get(entry.mileage) || 0;
      for (const item of entry.requiredItems) {
        trackInflection(services, item, "Required", entry.mileage, truckValue, thresholds);
      }
      for (const item of entry.asNeededItems) {
        trackInflection(services, item, "As-needed", entry.mileage, truckValue, thresholds);
      }
    }

    const currentValue = valueByMileage.get(state.currentMileage) || valueByMileage.get(state.targetMileage) || 0;
    elements.inflectionBody.innerHTML = [...services.values()]
      .sort((a, b) => a.serviceId - b.serviceId)
      .map((item) => `
        <tr>
          <td>${item.service}</td>
          <td>${item.type}</td>
          <td>${formatInflection(item.caution)}</td>
          <td>${formatInflection(item.questionable)}</td>
          <td>${formatInflection(item.notWorthIt)}</td>
          <td>${describeCurrentStatus(item.cost, currentValue, item.type, thresholds)}</td>
        </tr>
      `)
      .join("");
  }

  function trackInflection(store, item, type, mileage, truckValue, thresholds) {
    if (!store.has(item.serviceId)) {
      store.set(item.serviceId, {
        serviceId: item.serviceId,
        service: item.service,
        type,
        cost: item.cost,
        caution: null,
        questionable: null,
        notWorthIt: null,
      });
    }

    const record = store.get(item.serviceId);
    const ratio = truckValue > 0 ? item.cost / truckValue : Infinity;

    if (!record.caution && ratio >= thresholds.maintenanceToValueCaution) {
      record.caution = mileage;
    }
    if (!record.questionable && ratio >= thresholds.maintenanceToValueQuestionable) {
      record.questionable = mileage;
    }
    if (!record.notWorthIt && ratio >= thresholds.maintenanceToValueNotWorthIt && type === "As-needed") {
      record.notWorthIt = mileage;
    }
  }

  function renderCostTable(serviceUsage, valueByMileage) {
    const currentValue = valueByMileage.get(state.currentMileage) || valueByMileage.get(state.targetMileage) || 0;
    elements.costTableBody.innerHTML = serviceUsage
      .map((service) => {
        const ratio = currentValue > 0 ? service.activeCost / currentValue : 0;
        return `
          <tr>
            <td>${service.id}</td>
            <td>${service.service}</td>
            <td>
              <input
                class="money-input"
                type="number"
                min="0"
                step="5"
                value="${service.activeCost}"
                data-service-id="${service.id}"
              />
            </td>
            <td>${service.requiredCount} required / ${service.asNeededCount} as-needed</td>
            <td>${describeCostNote(ratio, service)}</td>
          </tr>
        `;
      })
      .join("");

    for (const input of elements.costTableBody.querySelectorAll(".money-input")) {
      input.addEventListener("input", (event) => {
        const serviceId = Number(event.target.dataset.serviceId);
        const nextValue = Math.max(0, Number(event.target.value) || 0);
        state.costOverrides[serviceId] = nextValue;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.costOverrides));
        render();
      });
    }
  }

  function renderSources() {
    elements.sourcesList.innerHTML = state.data.valueModel.sources
      .map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.name}</a></li>`)
      .join("");
  }

  function basePlotLayout(xTitle, yTitle) {
    return {
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { family: 'Georgia, "Times New Roman", serif', color: "#1f2a2b" },
      xaxis: {
        title: xTitle,
        gridcolor: "rgba(31,42,43,0.08)",
        zeroline: false,
      },
      yaxis: {
        title: yTitle,
        gridcolor: "rgba(31,42,43,0.08)",
        zeroline: false,
        tickprefix: yTitle === "USD" ? "$" : "",
      },
      legend: { orientation: "h", y: 1.1 },
    };
  }

  function renderPills(items) {
    if (!items.length) {
      return '<span class="pill">None</span>';
    }
    return items
      .map((item) => `<span class="pill">${item.service} | ${formatMoney(item.cost)}</span>`)
      .join("");
  }

  function describeCurrentStatus(cost, truckValue, type, thresholds) {
    const ratio = truckValue > 0 ? cost / truckValue : Infinity;
    if (type === "Required") {
      if (ratio >= thresholds.maintenanceToValueQuestionable) {
        return "High burden, but still required";
      }
      return "Economically normal for a required item";
    }
    if (ratio >= thresholds.maintenanceToValueNotWorthIt) {
      return "Not worth it by value-only heuristic";
    }
    if (ratio >= thresholds.maintenanceToValueQuestionable) {
      return "Questionable unless condition demands it";
    }
    if (ratio >= thresholds.maintenanceToValueCaution) {
      return "Worth reviewing before approving";
    }
    return "Reasonable relative to truck value";
  }

  function describeCostNote(ratio, service) {
    if (service.asNeededCount > 0 && ratio >= state.data.valueModel.inflectionThresholds.maintenanceToValueQuestionable) {
      return "Large enough to review against truck value when this item comes up.";
    }
    if (service.requiredCount > 0 && ratio >= state.data.valueModel.inflectionThresholds.maintenanceToValueQuestionable) {
      return "Expensive for a routine item, but this service appears in required intervals.";
    }
    return "Low-to-moderate burden relative to projected truck value.";
  }

  function formatInflection(mileage) {
    return mileage ? formatMileage(mileage) : "Not reached by 500k";
  }

  function getServiceCost(serviceId, fallbackCost) {
    return Number.isFinite(state.costOverrides[serviceId]) ? state.costOverrides[serviceId] : fallbackCost;
  }

  function loadOverrides() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function formatMoney(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatPercent(value) {
    return `${(value * 100).toFixed(1)}%`;
  }

  function formatMileage(value) {
    return `${Math.round(value).toLocaleString()} mi`;
  }

  function titleCase(value) {
    return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase()).trim();
  }
})();
