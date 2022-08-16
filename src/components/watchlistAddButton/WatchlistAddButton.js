import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectQuote,
  } from '../quoteContainer/quoteSlice';
import {
    selectStocks,
    addToWatchlist,
} from '../stockList/stocksSlice';

export function WatchlistAddButton({symbol}) {
    const quote = useSelector(selectQuote);
    const stocks = useSelector(selectStocks);
    const dispatch = useDispatch();

    function handleClick() {
        dispatch(addToWatchlist({
            description: quote.companyProfile.data.name,
            displaySymbol: symbol,
            symbol: symbol,
            quote: quote.quote.data,
        }));
    }

    const notOnWatchlist = stocks.watchlist.data.filter((item) => item.symbol === symbol).length === 0;

    if (notOnWatchlist) {
        return <button className='button2' onClick={handleClick}>+ Add to Watchlist</button>
    } else {
        return null
    }
    
}