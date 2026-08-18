let computedActualTotal = 0;
let originalBatchSize = null;
let isApplied = false;

function toggleBatchTooltip() {
  const tooltip = document.getElementById('batchTooltip');
  if (tooltip) tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
}

function toggleAddTooltip() {
  const tooltip = document.getElementById('addTooltip');
  if (tooltip) tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
}

function switchSubTab(subTabId) {
  const container = document.getElementById('tab-calculator');
  if (!container) return;
  
  container.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  container.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  if (subTabId === 'tab-resultat') {
    container.querySelectorAll('.tab-btn')[0].classList.add('active');
  } else {
    container.querySelectorAll('.tab-btn')[1].classList.add('active');
  }
  const target = document.getElementById(subTabId);
  if (target) target.classList.add('active');
}

function onCauseChange() {
  const causeEl = document.getElementById('missingComponent');
  if (!causeEl) return;
  const cause = causeEl.value;
  const creamFatGroup = document.getElementById('creamFatGroup');
  const addLabel = document.getElementById('addLabel');

  if (creamFatGroup && addLabel) {
    if (cause.startsWith('cream')) {
      creamFatGroup.style.display = 'block';
      addLabel.innerText = 'Hoeveelheid room toevoegen:';
    } else if (cause.startsWith('fat')) {
      creamFatGroup.style.display = 'none';
      addLabel.innerText = 'Hoeveelheid vloeibaar vet toevoegen:';
    } else {
      creamFatGroup.style.display = 'none';
      addLabel.innerText = 'Hoeveelheid room/vet toevoegen:';
    }
  }

  calculate();
}

function toggleBatchSizeState() {
  const batchInput = document.getElementById('batchSize');
  if (!batchInput) return;

  if (!isApplied) {
    if (computedActualTotal > 0) {
      originalBatchSize = parseFloat(batchInput.value) || 0;
      batchInput.value = Math.round(computedActualTotal);
      isApplied = true;
      calculate();
    }
  } else {
    if (originalBatchSize !== null) {
      batchInput.value = originalBatchSize;
      originalBatchSize = null;
      isApplied = false;
      calculate();
    }
  }
}

function resetCalculator() {
  const batchSize = document.getElementById('batchSize');
  const currentFat = document.getElementById('currentFat');
  const targetFat = document.getElementById('targetFat');
  const creamFat = document.getElementById('creamFat');
  const missingComponent = document.getElementById('missingComponent');

  if (batchSize) batchSize.value = '';
  if (currentFat) currentFat.value = '';
  if (targetFat) targetFat.value = '';
  if (creamFat) creamFat.value = '';
  if (missingComponent) missingComponent.value = 'cream_less';

  const batchTooltip = document.getElementById('batchTooltip');
  const addTooltip = document.getElementById('addTooltip');
  if (batchTooltip) batchTooltip.style.display = 'none';
  if (addTooltip) addTooltip.style.display = 'none';

  originalBatchSize = null;
  isApplied = false;
  
  onCauseChange();
}

function calculate() {
  const batchSizeEl = document.getElementById('batchSize');
  const currentFatEl = document.getElementById('currentFat');
  const targetFatEl = document.getElementById('targetFat');
  const missingComponentEl = document.getElementById('missingComponent');

  if (!batchSizeEl || !currentFatEl || !targetFatEl || !missingComponentEl) return;

  const inputBatchSize = parseFloat(batchSizeEl.value) || 0;
  const currentFat = parseFloat(currentFatEl.value) || 0;
  const targetFat = parseFloat(targetFatEl.value) || 0;
  const missingComponent = missingComponentEl.value;

  const activeBatchSize = (isApplied && computedActualTotal > 0) ? Math.round(computedActualTotal) : inputBatchSize;

  let additionType = 'cream';
  const creamFatEl = document.getElementById('creamFat');
  let effectiveCreamFat = creamFatEl ? (parseFloat(creamFatEl.value) || 0) : 0;

  if (missingComponent.startsWith('fat')) {
    additionType = 'fat';
    effectiveCreamFat = 100;
  } else if (missingComponent.startsWith('water')) {
    additionType = 'water';
  }

  const rowAddIngredient = document.getElementById('rowAddIngredient');
  const rowAddWater = document.getElementById('rowAddWater');
  const addTooltip = document.getElementById('addTooltip');
  const errorSection = document.getElementById('errorSection');

  let addAmount = 0;
  let waterToAdd = 0;
  let stepsHtml = '';

  const ingredientName = additionType === 'fat' ? 'vloeibaar vet' : 'room';

  const isMoreCause = (missingComponent === 'cream_more' || missingComponent === 'fat_more' || missingComponent === 'water_less');
  const isLessCause = (missingComponent === 'cream_less' || missingComponent === 'fat_less' || missingComponent === 'water_more');

  let hasError = false;

  if (inputBatchSize > 0 && currentFat > 0 && targetFat > 0 && errorSection) {
    if (isMoreCause && currentFat < targetFat) {
      hasError = true;
      let oorzaakTekst = "er te veel room/vet";
      if (missingComponent === 'water_less') oorzaakTekst = "er te weinig water";
      errorSection.innerHTML = `
        <div class="error-box">
          <strong>⚠️ Onmogelijke combinatie!</strong><br>
          Als ${oorzaakTekst} is gedoseerd, moet het gemeten vetgehalte <strong>hoger</strong> zijn dan het gewenste vetgehalte (${targetFat}%).<br><br>
          Het gemeten vetgehalte is nu <strong>${currentFat}%</strong> (te laag). Kies een andere oorzaak.
        </div>`;
    } else if (isLessCause && currentFat > targetFat) {
      hasError = true;
      let oorzaakTekst = "er te weinig room/vet";
      if (missingComponent === 'water_more') oorzaakTekst = "er te veel water";
      errorSection.innerHTML = `
        <div class="error-box">
          <strong>⚠️ Onmogelijke combinatie!</strong><br>
          Als ${oorzaakTekst} is gedoseerd, moet het gemeten vetgehalte <strong>lager</strong> zijn dan het gewenste vetgehalte (${targetFat}%).<br><br>
          Het gemeten vetgehalte is nu <strong>${currentFat}%</strong> (te hoog). Kies een andere oorzaak.
        </div>`;
    } else if (currentFat < targetFat && additionType === 'cream' && effectiveCreamFat <= targetFat && effectiveCreamFat > 0) {
      hasError = true;
      errorSection.innerHTML = `
        <div class="error-box">
          <strong>⚠️ Ongeldig vetgehalte room!</strong><br>
          Het vetgehalte van de toe te voegen room (${effectiveCreamFat}%) moet <strong>hoger</strong> zijn dan het gewenste vetgehalte (${targetFat}%).
        </div>`;
    } else {
      errorSection.innerHTML = '';
    }
  } else if (errorSection) {
    errorSection.innerHTML = '';
  }

  if (!hasError && activeBatchSize > 0) {
    if (currentFat > 0 && targetFat > currentFat) {
      if (rowAddIngredient) rowAddIngredient.style.display = 'flex';
      if (addTooltip) addTooltip.style.display = addTooltip.style.display === 'block' ? 'block' : 'none';
      if (rowAddWater) rowAddWater.style.display = 'none';

      if (effectiveCreamFat > targetFat) {
        addAmount = ((targetFat - currentFat) / (effectiveCreamFat - targetFat)) * activeBatchSize;
        
        const currentFatKg = (activeBatchSize * currentFat) / 100;
        const addFatKg = (addAmount * effectiveCreamFat) / 100;
        const totalFatKgVal = currentFatKg + addFatKg;
        const totalBatchVal = activeBatchSize + addAmount;

        stepsHtml = `
          <div class="calc-step"><strong>Stap 1: Huidige hoeveelheid vet</strong><br>
          ${activeBatchSize} kg × ${currentFat.toFixed(2)}% = ${currentFatKg.toFixed(2)} kg vet</div>
          <div class="calc-step"><strong>Stap 2: Benodigde ${ingredientName} berekenen</strong><br>
          (${targetFat.toFixed(2)}% - ${currentFat.toFixed(2)}%) / (${effectiveCreamFat.toFixed(2)}% - ${targetFat.toFixed(2)}%) × ${activeBatchSize} kg = <strong>${Math.round(addAmount)} kg ${ingredientName}</strong></div>
          <div class="calc-step"><strong>Stap 3: Vet uit toevoeging</strong><br>
          ${Math.round(addAmount)} kg × ${effectiveCreamFat.toFixed(2)}% = ${addFatKg.toFixed(2)} kg vet</div>
          <div class="calc-step"><strong>Stap 4: Totale batch & vet</strong><br>
          Totale batch na correctie: ${activeBatchSize} kg + ${Math.round(addAmount)} kg = <strong>${Math.round(totalBatchVal)} kg</strong><br>
          Totaal vet: ${currentFatKg.toFixed(2)} kg + ${addFatKg.toFixed(2)} kg = <strong>${Math.round(totalFatKgVal)} kg vet</strong></div>
        `;
      } else {
        stepsHtml = '<p style="margin:0; color:#c0392b;">Het vetgehalte van de toevoeging moet hoger zijn dan het gewenste vetgehalte.</p>';
      }
    } 
    else if (currentFat > targetFat && targetFat > 0) {
      if (rowAddIngredient) rowAddIngredient.style.display = 'none';
      if (addTooltip) addTooltip.style.display = 'none';
      if (rowAddWater) rowAddWater.style.display = 'flex';

      waterToAdd = ((currentFat / targetFat) - 1) * activeBatchSize;
      
      const currentFatKg = (activeBatchSize * currentFat) / 100;
      const totalBatchVal = activeBatchSize + waterToAdd;

      stepsHtml = `
        <div class="calc-step"><strong>Stap 1: Huidige hoeveelheid vet</strong><br>
        ${activeBatchSize} kg × ${currentFat.toFixed(2)}% = ${currentFatKg.toFixed(2)} kg vet</div>
        <div class="calc-step"><strong>Stap 2: Water toevoegen voor verdunning</strong><br>
        ( ${currentFat.toFixed(2)}% / ${targetFat.toFixed(2)}% - 1 ) × ${activeBatchSize} kg = <strong>${Math.round(waterToAdd)} kg water</strong></div>
        <div class="calc-step"><strong>Stap 3: Totale batch & vet</strong><br>
        Totale batch na correctie: ${activeBatchSize} kg + ${Math.round(waterToAdd)} kg = <strong>${Math.round(totalBatchVal)} kg</strong><br>
        Totaal vet blijft ongewijzigd: <strong>${Math.round(currentFatKg)} kg vet</strong></div>
      `;
    } else {
      if (rowAddIngredient) rowAddIngredient.style.display = 'flex';
      if (rowAddWater) rowAddWater.style.display = 'flex';
      stepsHtml = '<p style="margin:0; font-style:italic; color:#666;">Vul de gegevens in om de berekening in stappen te zien.</p>';
    }
  } else {
    stepsHtml = '<p style="margin:0; color:#c0392b;">Corrigeer de invoer om de berekening in stappen te zien.</p>';
  }

  const totalBatch = activeBatchSize + addAmount + waterToAdd;

  const addValueEl = document.getElementById('addValue');
  const waterToAddEl = document.getElementById('waterToAdd');
  const totalBatchEl = document.getElementById('totalBatch');
  const calcStepsEl = document.getElementById('calcSteps');

  if (addValueEl) addValueEl.innerText = Math.round(addAmount) + ' kg';
  if (waterToAddEl) waterToAddEl.innerText = Math.round(waterToAdd) + ' kg';
  if (totalBatchEl) totalBatchEl.innerText = Math.round(totalBatch) + ' kg';
  if (calcStepsEl) calcStepsEl.innerHTML = stepsHtml;

  const actualBatchLabelEl = document.getElementById('actualBatchLabel');
  const actualBatchValueEl = document.getElementById('actualBatchValue');
  const detailsEl = document.getElementById('actualBatchDetails');
  const applyButton = document.querySelector('.btn-apply-batch');

  if (!hasError && inputBatchSize > 0 && currentFat > 0 && targetFat > 0 && (effectiveCreamFat > 0 || missingComponent.startsWith('water'))) {
    let devIngredientLabel = ingredientName;
    let calcCreamFat = effectiveCreamFat;

    if (missingComponent.startsWith('water') && calcCreamFat === 0) {
      calcCreamFat = 43; 
    }

    const targetFatKgPlanned = (inputBatchSize * targetFat) / 100;
    const plannedIngredient = (targetFatKgPlanned / calcCreamFat) * 100;
    const plannedWater = inputBatchSize - plannedIngredient;

    let actualIngredient = 0;
    let actualWater = 0;
    let actualTotal = 0;

    if (missingComponent === 'cream_less' || missingComponent === 'cream_more' || missingComponent === 'fat_less' || missingComponent === 'fat_more') {
      actualWater = plannedWater;
      const ingredientFraction = currentFat / calcCreamFat;
      actualTotal = actualWater / (1 - ingredientFraction);
      actualIngredient = actualTotal - actualWater;
    } else {
      actualIngredient = plannedIngredient;
      const totalFatKgActual = (actualIngredient * calcCreamFat) / 100;
      actualTotal = (totalFatKgActual / currentFat) * 100;
      actualWater = actualTotal - actualIngredient;
    }

    computedActualTotal = actualTotal;

    const diffTotal = actualTotal - inputBatchSize;
    const diffIngredient = actualIngredient - plannedIngredient;
    const diffWater = actualWater - plannedWater;

    const colorIngredient = Math.abs(diffIngredient) < 0.5 ? '#27ae60' : '#c0392b';
    const colorWater = Math.abs(diffWater) < 0.5 ? '#27ae60' : '#c0392b';
    const colorTotal = Math.abs(diffTotal) < 0.5 ? '#27ae60' : '#c0392b';

    const diffIngredientTxt = Math.abs(diffIngredient) < 0.5 ? '' : ` (${diffIngredient > 0 ? '+' : ''}${Math.round(diffIngredient)} kg)`;
    const diffWaterTxt = Math.abs(diffWater) < 0.5 ? '' : ` (${diffWater > 0 ? '+' : ''}${Math.round(diffWater)} kg)`;
    const diffTotalTxt = Math.abs(diffTotal) < 0.5 ? '0 kg' : `${diffTotal > 0 ? '+' : ''}${Math.round(diffTotal)} kg`;

    if (actualBatchLabelEl && actualBatchValueEl) {
      if (isApplied) {
        actualBatchLabelEl.innerText = 'Origineel geplande batchgrootte:';
        actualBatchValueEl.innerText = Math.round(originalBatchSize) + ' kg';
      } else {
        actualBatchLabelEl.innerText = 'Vermoedelijke werkelijke batchgrootte:';
        actualBatchValueEl.innerText = Math.round(actualTotal) + ' kg';
      }
    }

    if (detailsEl) {
      detailsEl.innerHTML = `
        <div class="result-row">
          <span>Geplande hoeveelheid water:</span>
          <span class="result-value">${Math.round(plannedWater)} kg</span>
        </div>
        <div class="result-row">
          <span>Geplande hoeveelheid ${devIngredientLabel}:</span>
          <span class="result-value">${Math.round(plannedIngredient)} kg</span>
        </div>
        <hr style="border:0; border-top: 1px dashed var(--border-blue); margin: 8px 0;">
        <div class="result-row">
          <span>Werkelijk aanwezig water:</span>
          <span class="result-value" style="color:${colorWater}">${Math.round(actualWater)} kg${diffWaterTxt}</span>
        </div>
        <div class="result-row">
          <span>Werkelijk aanwezige ${devIngredientLabel}:</span>
          <span class="result-value" style="color:${colorIngredient}">${Math.round(actualIngredient)} kg${diffIngredientTxt}</span>
        </div>
        <div class="result-row" style="margin-top: 6px;">
          <span>Verschil met gepland:</span>
          <span class="result-value" style="color:${colorTotal}">${diffTotalTxt}</span>
        </div>
      `;
    }
  } else {
    computedActualTotal = 0;
    if (actualBatchLabelEl && actualBatchValueEl) {
      actualBatchLabelEl.innerText = isApplied ? 'Origineel geplande batchgrootte:' : 'Vermoedelijke werkelijke batchgrootte:';
      actualBatchValueEl.innerText = isApplied && originalBatchSize !== null ? Math.round(originalBatchSize) + ' kg' : '0 kg';
    }
    if (detailsEl) {
      detailsEl.innerHTML = '<p style="margin:0; font-style:italic; color:#666;">Vul alle vereiste velden correct in voor details.</p>';
    }
  }

  if (applyButton) {
    if (isApplied) {
      applyButton.innerText = '↺ Herstel originele batchgrootte';
      applyButton.style.backgroundColor = '#dc3545';
      applyButton.style.color = '#ffffff';
      applyButton.style.borderColor = '#dc3545';
    } else {
      applyButton.innerText = '↺ Overnemen als geplande batch';
      applyButton.style.backgroundColor = '';
      applyButton.style.color = '';
      applyButton.style.borderColor = '';
    }
  }
}

// Enter-toets navigatie logica
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), select'));
    const index = inputs.indexOf(document.activeElement);
    if (index > -1) {
      e.preventDefault();
      let nextIndex = index + 1;
      while (nextIndex < inputs.length) {
        const nextElem = inputs[nextIndex];
        if (nextElem.offsetParent !== null && !nextElem.disabled) {
          nextElem.focus();
          if (typeof nextElem.select === 'function') {
            nextElem.select();
          }
          break;
        }
        nextIndex++;
      }
    }
  }
});

// Excel Som Calculator Functie
function calculateExcelSum() {
  const textarea = document.getElementById('excelInput');
  const countEl = document.getElementById('excelCount');
  const sumEl = document.getElementById('excelSum');
  const yieldKgEl = document.getElementById('excelYieldKg');
  const waterEl = document.getElementById('excelWater');
  const evapEl = document.getElementById('excelEvap');

  if (!textarea || !countEl || !sumEl) return;

  const text = textarea.value;
  const lines = text.split(/\r?\n/);

  let totalSum = 0;
  let validCount = 0;

  lines.forEach(line => {
    let cleanLine = line.trim();
    if (cleanLine !== '') {
      cleanLine = cleanLine.replace(/\./g, '').replace(',', '.');
      
      const num = parseFloat(cleanLine);
      if (!isNaN(num)) {
        totalSum += num;
        validCount++;
      }
    }
  });

  const yieldKg = totalSum * 1.08;
  const water = yieldKg * 0.01;
  const evap = yieldKg * 0.99;

  countEl.innerText = validCount;
  sumEl.innerText = totalSum.toLocaleString('nl-NL', { maximumFractionDigits: 2 });
  if (yieldKgEl) yieldKgEl.innerText = yieldKg.toLocaleString('nl-NL', { maximumFractionDigits: 2 });
  if (waterEl) waterEl.innerText = water.toLocaleString('nl-NL', { maximumFractionDigits: 2 });
  if (evapEl) evapEl.innerText = evap.toLocaleString('nl-NL', { maximumFractionDigits: 2 });
}
