import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Finnhub } from '../../api/Finnhub';

const initialState = {
    searchTerm: '',
    watchlist: {
        loading: false, 
        hasError: false, 
        data: [
            {
                description: "APPLE INC",
                displaySymbol: "AAPL",
                symbol: "AAPL",
                type: "Common Stock",
                quote: {
                    c: 261.74,
                    h: 263.31,
                    l: 260.68,
                    o: 261.07,
                    pc: 3.45,
                    t: 1582641000 
                },
            },
            {
                description: "TESLA INC",
                displaySymbol: "TSLA",
                symbol: "TSLA",
                type: "Common Stock",
                quote: {
                    c: 261.75,
                    h: 263.31,
                    l: 260.68,
                    o: 261.07,
                    pc: -234,
                    t: 1582641000 
                },
            },
        ]
    },
    searchResults: {
        loading: true,
        hasError: false, 
        results: {}
    }, 
};

export const fetchSymbols = createAsyncThunk(
    'stocks/fetchSymbols',
    async (searchTerm) => {
        const response = await Finnhub.symbolLookup(searchTerm);
        return response;
    }
)

// export const updateStockPrice = createAsyncThunk(
//     'stocks/updatePrice',
//     async (symbol, { rejectWithValue }) => {
//         const stocks = useSelector(selectStocks);
//         const response = await Finnhub.fetchQuote(symbol);
//         const dataExists = (
//             typeof response.c === 'number' && 
//             typeof response.d === 'number' && 
//             typeof response.dp === 'number' && 
//             typeof response.h === 'number' && 
//             typeof response.l === 'number' && 
//             typeof response.o === 'number'
//         );
//         if (dataExists) {
//             const index = stocks.watchlist.findIndex((stock) => stock.symbol === symbol);
//             return { symbol: symbol, index: index, response: response };
//         } else {
//             return rejectWithValue(`Quote response missing data when updating stock price for ${symbol}.`);
//         }
//     }
// )

export const updateWatchlistPrices = createAsyncThunk(
    'stocks/updateWatchlistPrices',
    async (watchlist, { rejectWithValue, getState }) => {
        const state = getState();

        console.log('updateWatchlistPrices call with the folowing watchlist: ');
        console.log(state.stocks.watchlist.data);

        const response = await Finnhub.fetchWatchlistQuotes(state.stocks.watchlist.data);

        const dataExists = () => {
            for (let i = 0; i < Object.keys(response).length; i++) {
                const currentStockSymbol = Object.keys(response)[i];
                if (
                    typeof response[currentStockSymbol].c === 'number' && 
                    typeof response[currentStockSymbol].d === 'number' && 
                    typeof response[currentStockSymbol].dp === 'number' && 
                    typeof response[currentStockSymbol].h === 'number' && 
                    typeof response[currentStockSymbol].l === 'number' && 
                    typeof response[currentStockSymbol].o === 'number'
                ) {
                    // Do nothing
                } else {
                    return false
                }
                return true
            }
        }

        if (dataExists) {
            return response;
        } else {
            return rejectWithValue(`Quote response missing data when updating stock prices.`);
        }
    }
)

export const stocksSlice = createSlice({
    name: 'stocks',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            if (action.payload === '') {
                state.searchResults.results = [];
            }
        },
        setSearchResultsLoading: (state) => {
            state.searchResults.loading = true;
        },
        addToWatchlist: (state, action) => {
            state.watchlist.data.push(action.payload);
        },
    },
    extraReducers: {
        [fetchSymbols.pending]: (state, action) => {
            state.searchResults.loading = true;
            state.searchResults.hasError = false;
        },
        [fetchSymbols.fulfilled]: (state, action) => {
            state.searchResults.loading = false;
            state.searchResults.hasError = false;
            state.searchResults.results = action.payload;
        },
        [fetchSymbols.rejected]: (state, action) => {
            state.searchResults.loading = false;
            state.searchResults.hasError = true;
            console.log('fetch symbols error:');
            console.log(action.payload);
        },
        // [updateStockPrice.pending]: (state, action) => {
        //     state.watchlist[action.payload.index].quoteLoading = true;
        //     state.watchlist[action.payload.index].quoteHasError = false;
        // },
        // [updateStockPrice.fulfilled]: (state, action) => {
        //     state.watchlist[action.payload.index].quoteLoading = false;
        //     state.watchlist[action.payload.index].quoteHasError = false;
        //     state.watchlist[action.payload.index].quote = action.payload.response;
        // },
        // [updateStockPrice.rejected]: (state, action) => {
        //     console.log('action.payload:');
        //     console.log(action.payload);
        //     state.watchlist[action.payload.index].quoteLoading = false;
        //     state.watchlist[action.payload.index].quoteHasError = true;
        //     console.log(`error when fetching updated price for ${action.payload.symbol}`);
        //     console.log(action.payload);
        // },
        [updateWatchlistPrices.pending]: (state, action) => {
            state.watchlist.loading = true;
            state.watchlist.hasError = false;
        },
        [updateWatchlistPrices.fulfilled]: (state, action) => {
            state.watchlist.loading = false;
            state.watchlist.hasError = false;

            // Loop through payload object and update quote for each stock 
            for (let i = 0; i < Object.keys(action.payload).length; i++) {
                console.log('loop ran');
                const currentStockSymbol = Object.keys(action.payload)[i];
                const matchingWatchlistIndex = state.watchlist.data.findIndex((stock) => stock.symbol === currentStockSymbol);
                state.watchlist.data[matchingWatchlistIndex].quote = action.payload[currentStockSymbol];
            }
        },
        [updateWatchlistPrices.rejected]: (state, action) => {
            state.watchlist.loading = false;
            state.watchlist.hasError = true;
            console.log('update watchlist error:');
            console.log(action.payload);
        },
    },
})

export const { 
    setSearchTerm, 
    setSearchResultsLoading, 
    addToWatchlist ,
} = stocksSlice.actions;

export const selectStocks = (state) => state.stocks;

export default stocksSlice.reducer;