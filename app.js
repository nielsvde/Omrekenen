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
