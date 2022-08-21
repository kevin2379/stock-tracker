import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
    selectQuote,
    APILimitReachedOff,
  } from '../quoteContainer/quoteSlice';
  import {
    selectStocks,
    stocksAPILimitReachedOff,
  } from '../stockList/stocksSlice';

export function APILimitError() {
    const quote = useSelector(selectQuote);
    const stocks = useSelector(selectStocks);
    const dispatch = useDispatch();

    if (quote.APILimitReached || stocks.APILimitReached) {
        setTimeout(() => {
            dispatch(APILimitReachedOff());
            dispatch(stocksAPILimitReachedOff());
        }, 1000 * 60);

        return (
            <div style={{width: '100%', textAlign: 'center', marginBottom: '1rem'}}>
                <p style={{color: 'red', fontWeight: '700'}}>API limit reached! Please wait one minute, then refresh.</p>
            </div>
        )
    } else {
        return null;
    }

}