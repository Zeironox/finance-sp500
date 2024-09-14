async function fetchSP500Data() {
    const response = await fetch('data/sp500_data.csv');
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
    
    // Filtra i dati per il range di date
    const filteredData = data.filter(entry => entry.Date >= startDate && entry.Date <= endDate);

    if (filteredData.length === 0) {
        return 'Nessun dato trovato per il periodo specificato.';
    }

    // Calcola il totale investito e il valore finale
    let totalInvested = 0;
    let totalValue = 0;
    
    for (let entry of filteredData) {
        const price = parseFloat(entry.Close);
        totalInvested += investment;
        totalValue += (investment / price) * price;
    }

    const profit = totalValue - totalInvested;

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
        <td>${profit === 'Nessun dato trovato per il periodo specificato.' ? profit : '$' + profit}</td>
    `;
    table.appendChild(row);
}
