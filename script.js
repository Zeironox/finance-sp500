function calculateProfit() {
    const investment = parseFloat(document.getElementById('investment').value);
    const priceStart = parseFloat(document.getElementById('priceStart').value);
    const priceEnd = parseFloat(document.getElementById('priceEnd').value);
    
    if (isNaN(investment) || isNaN(priceStart) || isNaN(priceEnd) || priceStart <= 0) {
        document.getElementById('result').innerText = 'Per favore, inserisci valori validi.';
        return;
    }
    
    const shares = investment / priceStart;
    const finalValue = shares * priceEnd;
    const profit = finalValue - investment;
    
    document.getElementById('result').innerText = `Guadagno: €${profit.toFixed(2)}`;
}
