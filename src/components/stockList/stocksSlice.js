import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
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
    async (searchTerm, { rejectWithValue }) => {
        const response = await Finnhub.symbolLookup(searchTerm);

        function dataExists() {
            if (typeof response.count !== 'number') {
                console.log('count error');
                return false;
            }
            for (let i = 0; i < response.result.length; i++) {
                if (
                    typeof response.result[i].description === 'string' && 
                    typeof response.result[i].displaySymbol === 'string' && 
                    typeof response.result[i].symbol === 'string' && 
                    typeof response.result[i].type === 'string'
                ) {
                    // Do nothing
                } else {
                    return false
                }
                return true
            }
        }

        if (dataExists()) {
            return response;
        } else {
            return rejectWithValue(`Response missing data when fetching searched symbols.`);
        }    
    }
)

export const updateWatchlistPrices = createAsyncThunk(
    'stocks/updateWatchlistPrices',
    async (watchlist, { rejectWithValue, getState }) => {
        const state = getState();

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

        if (dataExists()) {
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
        [updateWatchlistPrices.pending]: (state, action) => {
            state.watchlist.loading = true;
            state.watchlist.hasError = false;
        },
        [updateWatchlistPrices.fulfilled]: (state, action) => {
            state.watchlist.loading = false;
            state.watchlist.hasError = false;

            // Loop through payload object and update quote for each stock 
            for (let i = 0; i < Object.keys(action.payload).length; i++) {
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
    addToWatchlist,
} = stocksSlice.actions;

export const selectStocks = (state) => state.stocks;

export default stocksSlice.reducer;