import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectQuote,
    fetchCompanyProfile,
    fetchOHLCV,
    fetchQuote,
  } from './quoteSlice';
import { useParams } from "react-router-dom";
import { WatchlistAddButton } from '../watchlistAddButton/WatchlistAddButton';
import { QuoteHeader } from '../quoteHeader/QuoteHeader';


export function QuoteContainer() {
    const quote = useSelector(selectQuote);
    const dispatch = useDispatch();
    const { symbol } = useParams();

    useEffect(() => {
        dispatch(fetchCompanyProfile(symbol));
        dispatch(fetchQuote(symbol));
        dispatch(fetchOHLCV(symbol));
    }, [symbol])

    return(
        <>
            <QuoteHeader symbol={symbol} />
        </>
    );
}
