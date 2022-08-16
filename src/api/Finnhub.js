const baseURL = 'https://finnhub.io/api/v1';
const apiKey = process.env.REACT_APP_FINNHUB_KEY;

const Finnhub = {
    async symbolLookup(searchTerm) {
        try {
            const response = await fetch(`${baseURL}/search?q=${searchTerm}&token=${apiKey}`);
            if (response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse;
            }
        }
        catch(error) {
            console.log(error);
        }
    },
    // async fetchSymbols(exchange) {
    //     try {
    //         const response = await fetch(`${baseURL}/stock/symbol?exchange=${exchange}&token=${apiKey}`);
    //         if (response.ok) {
    //             const jsonResponse = await response.json();
    //             return jsonResponse;
    //         }
    //     }
    //     catch(error) {
    //         console.log(error);
    //     }
    // },
    async fetchCompanyProfile(symbol) {
        try {
            const response = await fetch(`${baseURL}/stock/profile2?symbol=${symbol}&token=${apiKey}`);
            if (response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse;
            }
        }
        catch(error) {
            console.log(error);
        }
    },
    async fetchQuote(symbol) {
        try {
            const response = await fetch(`${baseURL}/quote?symbol=${symbol}&token=${apiKey}`);
            if (response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse;
            }
        }
        catch(error) {
            console.log(error);
        }
    },
    async fetchWatchlistQuotes(watchlist) {
        try {
            const requests = watchlist.map((stock) => fetch(`${baseURL}/quote?symbol=${stock.symbol}&token=${apiKey}`));
            const responses = await Promise.all(requests);

            const errors = responses.filter((response) => !response.ok);

            if (errors.length > 0) {
                throw errors.map((response) => Error(response.statusText));
            } else {
                const json = responses.map((response) => response.json());
                const data = await Promise.all(json);

                // Create object that matches received prices with the correct symbol before returning.
                let stockPricesObj = {};
                for (let i = 0; i < watchlist.length; i++) {
                    stockPricesObj[watchlist[i].symbol] = data[i];
                }
                return stockPricesObj;
            }
        }
        catch (errors) {
            errors.forEach((error) => console.error(error));
        }
    },
    async fetchTickData(symbol) {
        const date = '2022-08-12'; // Adjust to be today's date
        const limit = 500;
        const skip = 0;

        try {
            const response = await fetch(`https://tick.finnhub.io/stock/tick?symbol=${symbol}&date=${date}&limit=${limit}&skip=${skip}&token=${apiKey}`);
            if (response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse;
            }
        }
        catch(error) {
            console.log(error);
        }
    },
    async fetchOHLCV(symbol) {
        const resolution = "D"; // Supported resolution includes 1, 5, 15, 30, 60, D, W, M 
        const from = 1590988249; // UNIX timestamp. Interval initial value.
        const to = 1591852249; // UNIX timestamp. Interval end value.

        try {
            const response = await fetch(`${baseURL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`);
            if (response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse;
            }
        }
        catch(error) {
            console.log(error);
        }
    },
}

export { Finnhub };