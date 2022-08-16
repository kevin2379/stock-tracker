import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../components/counter/counterSlice';
import stocksReducer from '../components/stockList/stocksSlice';
import columnLayoutReducer from '../components/columnLayout/columnLayoutSlice';
import quoteReducer from '../components/quoteContainer/quoteSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    stocks: stocksReducer,
    columnLayout: columnLayoutReducer,
    quote: quoteReducer,
  },
});
