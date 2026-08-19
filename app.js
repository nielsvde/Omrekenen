function calculateExcelSum() {
  const textarea = document.getElementById('excelInput');
  const countEl = document.getElementById('excelCount');
  const sumEl = document.getElementById('excelSum');

  if (!textarea || !countEl || !sumEl) return;

  const text = textarea.value;
  // Splits op enters/nieuwe regels
  const lines = text.split(/\r?\n/);

  let totalSum = 0;
  let validCount = 0;

  lines.forEach(line => {
    let cleanLine = line.trim();
    if (cleanLine !== '') {
      // Vervang eventuele duizendtallen-punten en zet komma om naar punt voor JavaScript
      cleanLine = cleanLine.replace(/\./g, '').replace(',', '.');
      
      const num = parseFloat(cleanLine);
      if (!isNaN(num)) {
        totalSum += num;
        validCount++;
      }
    }
  });

  countEl.innerText = validCount;
  // Optioneel: netjes formatteren met komma als decimaalteken
  sumEl.innerText = totalSum.toLocaleString('nl-NL', { maximumFractionDigits: 2 });
}
