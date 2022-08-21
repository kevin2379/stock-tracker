import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Finnhub } from '../../api/Finnhub';

const initialState = {
    companyProfile: {
        loading: true,
        hasError: false,
        data: {},
    },
    quote: {
        loading: true,
        hasError: false,
        data: {},
    },
    OHLCV: {
        loading: true,
        hasError: false,
        data: {},
    },
    chartTimeFilter: '1Y',
    APILimitReached: false,
};

export const fetchCompanyProfile = createAsyncThunk(
    'stocks/fetchCompanyProfile',
    async (symbol, { rejectWithValue }) => {
        const response = await Finnhub.fetchCompanyProfile(symbol);
        const dataExists = (
            typeof response.name === 'string' && 
            typeof response.exchange === 'string' && 
            typeof response.currency === 'string' && 
            typeof response.shareOutstanding === 'number'
        );

        if (dataExists) {
            return response;
        } else if (response === 429) {
            return 429;
        } else {
            return rejectWithValue('Company profile response missing data.');
        }
        
    }
)

export const fetchQuote = createAsyncThunk(
    'stocks/fetchQuote',
    async (symbol, { rejectWithValue }) => {
        const response = await Finnhub.fetchQuote(symbol);
        const dataExists = (
            typeof response.c === 'number' && 
            typeof response.d === 'number' && 
            typeof response.dp === 'number' && 
            typeof response.h === 'number' && 
            typeof response.l === 'number' && 
            typeof response.o === 'number'
        );
        if (dataExists) {
            return response;
        } else if (response === 429) {
            return 429;
        } else {
            return rejectWithValue('Quote response missing data.');
        }
    }
)

export const fetchOHLCV = createAsyncThunk(
    'stocks/fetchOHLCV',
    async (symbol, { rejectWithValue }) => {
        const response = await Finnhub.fetchOHLCV(symbol);
        const dataExists = (
            typeof response.c === 'object' && 
            typeof response.h === 'object' && 
            typeof response.l === 'object' && 
            typeof response.o === 'object'
        );
        if (dataExists) {
            // Check to make sure that all necessary data is there.
            // May need to add more checks once required values are known
            return response;
        } else if (response === 429) {
            return 429;
        } else {
            return rejectWithValue('OHLCV response missing data.');
        }
    }
)

export const quoteSlice = createSlice({
    name: 'quote',
    initialState,
    reducers: {
        setChartTimeFilter: (state, action) => {
            state.chartTimeFilter = action.payload;
        },
        APILimitReachedOff: (state, action) => {
            state.APILimitReached = false;
        }
    },
    extraReducers: {
        [fetchCompanyProfile.pending]: (state, action) => {
            state.companyProfile.loading = true;
            state.companyProfile.hasError = false;
        },
        [fetchCompanyProfile.fulfilled]: (state, action) => {
            state.companyProfile.loading = false;
            state.companyProfile.hasError = false;
            if (action.payload === 429) {
                state.APILimitReached = true;
            } else {
                state.companyProfile.data = action.payload;
            }
        },
        [fetchCompanyProfile.rejected]: (state, action) => {
            state.companyProfile.loading = false;
            state.companyProfile.hasError = true;
            console.log('fetch company profile error:');
            console.log(action.payload);
        },
        [fetchQuote.pending]: (state, action) => {
            state.quote.loading = true;
            state.quote.hasError = false;
        },
        [fetchQuote.fulfilled]: (state, action) => {
            state.quote.loading = false;
            state.quote.hasError = false;
            if (action.payload === 429) {
                state.APILimitReached = true;
            } else {
                state.quote.data = action.payload;
            }
        },
        [fetchQuote.rejected]: (state, action) => {
            state.quote.loading = false;
            state.quote.hasError = true;
            console.log('fetch quote error:');
            console.log(action.payload);
        },
        [fetchOHLCV.pending]: (state, action) => {
            state.OHLCV.loading = true;
            state.OHLCV.hasError = false;
        },
        [fetchOHLCV.fulfilled]: (state, action) => {
            state.OHLCV.loading = false;
            state.OHLCV.hasError = false;
            if (action.payload === 429) {
                state.APILimitReached = true;
            } else {
                state.OHLCV.data = action.payload;
            }
        },
        [fetchOHLCV.rejected]: (state, action) => {
            state.OHLCV.loading = false;
            state.OHLCV.hasError = true;
            console.log('fetch OHLCV error:');
            console.log(action.payload);
        },
    },
})

export const { setChartTimeFilter, APILimitReachedOff } = quoteSlice.actions;

export const selectQuote = (state) => state.quote;

export default quoteSlice.reducer;