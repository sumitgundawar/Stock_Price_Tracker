localStorage.clear();
var tickers = JSON.parse(localStorage.getItem('tickers')) || [];
var lastPrices = {};
var counter = 10;
var companies = []; // JSON data will be stored here

// Fetch CSV data from the file
fetch("/static/symbols.csv")
    .then(response => response.text())
    .then(data => {
        companies = parseCsvData(data);
        startUpdateCycle();
    })
    .catch(error => {
        console.error("Error fetching CSV data:", error);
    });

function parseCsvData(csvData) {
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(",");
        if (currentLine.length === headers.length) {
            const company = {};
            for (let j = 0; j < headers.length; j++) {
                company[headers[j]] = currentLine[j];
            }
            result.push(company);
        }
    }

    return result;
}

function startUpdateCycle() {
    updatePrices();
    setInterval(function () {
        counter--;
        $('#counter').text(counter);
        if (counter <= 0) {
            updatePrices();
            counter = 10;
        }
    }, 1000);
}

$(document).ready(function () {
    tickers.forEach(function (ticker) {
        var company = companies.find(c => c["Symbol"] === ticker);
        if (company) {
            addTickerToGrid(ticker, company["Company Name"]);
        }
    });

    $('#add-ticker-form').submit(function (event) {
        event.preventDefault();
        var newticker = $('#new-ticker').val().toUpperCase();
        var company = companies.find(c => c["Symbol"] === newticker);
        
        if (!tickers.includes(newticker) && company) {
            addTickerToGrid(newticker, company["Company Name"]);
            tickers.push(newticker);
            localStorage.setItem('tickers', JSON.stringify(tickers));
        }
        
        $('#new-ticker').val('');
        updatePrices();
    });

    $('#tickers-grid').on('click', '.remove-btn', function () {
        var tickerToRemove = $(this).data('ticker');
        tickers = tickers.filter(t => t !== tickerToRemove);
        localStorage.setItem('tickers', JSON.stringify(tickers));
        $(`#${tickerToRemove}`).remove();
    });

    $('#new-ticker').on('input', function () {
        var searchTerm = $(this).val().trim().toLowerCase();
        var suggestions = companies.filter(company => {
            return company["Company Name"].toLowerCase().includes(searchTerm) || company["Symbol"].toLowerCase().includes(searchTerm);
        });

        var suggestionsHtml = suggestions.map(company => {
            return `<p>${company["Company Name"]} (${company["Symbol"]})</p>`;
        }).join("");

        $('#suggestions').html(suggestionsHtml);
    });

    $('#suggestions').on('click', 'p', function () {
        var suggestionText = $(this).text(); // Get the entire suggestion text
        var selectedSymbol = suggestionText.match(/\((.*?)\)/)[1]; // Extract the text between parentheses
        $('#new-ticker').val(selectedSymbol); // Replace the input value with the symbol
        $('#suggestions').html(''); // Clear the suggestions
    });

    startUpdateCycle();
});

function addTickerToGrid(ticker, companyName) {
    $('#tickers-grid').append(`<div id="${ticker}" class="stock-box">
    <h3>${companyName} (${ticker})</h3>
    <p id="${ticker}-price"></p>
    <p id="${ticker}-pct"></p>
    <button class="remove-btn" data-ticker="${ticker}">X</button>
    </div>`);
}

function updatePrices() {
    tickers.forEach(function (ticker) {
        $.ajax({
            url: '/get_stock_data',
            type: 'POST',
            data: JSON.stringify({ 'ticker': ticker }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                var changePercent = ((data.currentPrice - data.openPrice) / data.openPrice) * 100;
                var colorClass;
                if (changePercent <= -2) {
                    colorClass = 'dark-red';
                } else if (changePercent < 0) {
                    colorClass = 'red';
                } else if (changePercent == 0) {
                    colorClass = 'gray';
                } else if (changePercent <= 2) {
                    colorClass = 'green';
                } else {
                    colorClass = 'dark-green';
                }
                $(`#${ticker}-price`).text(`$${data.currentPrice}`);
                $(`#${ticker}-pct`).text(`${changePercent.toFixed(2)}%`);
                $(`#${ticker}-price`).removeClass('dark-red red gray green dark-green').addClass(colorClass);
                $(`#${ticker}-pct`).removeClass('dark-red red gray green dark-green').addClass(colorClass);

                var flashClass;
                if (lastPrices[ticker] > data.currentPrice) {
                    flashClass = 'red-flash';
                } else if (lastPrices[ticker] < data.currentPrice) {
                    flashClass = 'green-flash';
                } else {
                    flashClass = 'gray-flash';
                }

                lastPrices[ticker] = data.currentPrice;
                $(`#${ticker}`).addClass(flashClass);

                setTimeout(function () {
                    $(`#${ticker}`).removeClass(flashClass);
                }, 1000);
            }
        });
    });
}