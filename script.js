async function fetchSP500Data() {
    const response = await fetch('data/sp500_data.csv');  // Percorso relativo
    const csvText = await response.text();
    const lines = csvText.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(',');
        if (line.length === headers.length) {
            const entry = {};
            for (let j = 0; j < headers.length; j++) {
                entry[headers[j]] = line[j];
            }
            result.push(entry);
        }
    }

    return result;
}

async function calculateProfit(startDate, endDate, investment) {
    const data = await fetchSP500Data();

    // Trova il prezzo di acquisto
    const startEntry = data.find(entry => entry.Date.startsWith(startDate));
    const startPrice = parseFloat(startEntry ? startEntry.Close : 0);

    // Trova il prezzo attuale
    const endEntry = data.find(entry => entry.Date.startsWith(endDate));
    const endPrice = parseFloat(endEntry ? endEntry.Close : 0);

    if (startPrice === 0 || endPrice === 0) {
        return 'Dati non trovati per le date specificate.';
    }

    const shares = investment / startPrice;
    const finalValue = shares * endPrice;
    const profit = finalValue - investment;

    return profit.toFixed(2);
}

async function addInvestment() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (isNaN(amount) || amount <= 0 || !startDate || !endDate) {
        alert('Per favore, inserisci tutte le informazioni valide.');
        return;
    }

    const profit = await calculateProfit(startDate, endDate, amount);

    const table = document.getElementById('investment-table');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${startDate} a ${endDate}</td>
        <td>${amount.toFixed(2)}</td>
        <td>${profit === 'Dati non trovati per le date specificate.' ? profit : '$' + profit}</td>
    `;
    table.appendChild(row);
}
