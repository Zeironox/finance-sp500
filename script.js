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

async function calculateProfit() {
    const investment = parseFloat(document.getElementById('investment').value);
    if (isNaN(investment) || investment <= 0) {
        document.getElementById('result').innerText = 'Per favore, inserisci un importo valido.';
        return;
    }

    const data = await fetchSP500Data();
    const startPrice = parseFloat(data.find(entry => entry.Date === "2000-01-03").Close);
    const endPrice = parseFloat(data[data.length - 1].Close);

    const shares = investment / startPrice;
    const finalValue = shares * endPrice;
    const profit = finalValue - investment;

    document.getElementById('result').innerText = `Guadagno: $${profit.toFixed(2)}`;
}
