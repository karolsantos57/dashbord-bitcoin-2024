// Configurando o gráfico com Chart.js
const ctx = document.getElementById('bitcoinPriceChart').getContext('2d');
const bitcoinPriceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Será preenchido com datas
        datasets: [{
            label: 'Preço do Bitcoin (USD)',
            data: [], // Será preenchido com preços
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                }
            },
            y: {
                beginAtZero: false
            }
        }
    }
});

// Função para buscar os dados da API do CoinGecko
async function fetchBitcoinData() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7');
    const data = await response.json();
    
    const prices = data.prices;
    const labels = prices.map(price => new Date(price[0])); // Datas
    const priceData = prices.map(price => price[1]); // Preços

    // Atualizar o gráfico com os dados
    bitcoinPriceChart.data.labels = labels;
    bitcoinPriceChart.data.datasets[0].data = priceData;
    bitcoinPriceChart.update();
}

// Atualiza o preço atual ao vivo
async function fetchCurrentPrice() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();

    const currentPrice = data.bitcoin.usd;
    document.getElementById('current-price').innerHTML = `<h3>$${currentPrice.toFixed(2)}</h3>`;
}

// Carregar dados ao carregar a página
window.onload = () => {
    fetchBitcoinData();
    fetchCurrentPrice();

    // Atualiza o preço a cada 60 segundos
    setInterval(fetchCurrentPrice, 60000);
}
