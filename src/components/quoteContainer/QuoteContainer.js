import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    fetchCompanyProfile,
    fetchOHLCV,
    fetchQuote,
  } from './quoteSlice';
import { useParams } from "react-router-dom";
import { QuoteHeader } from '../quoteHeader/QuoteHeader';
import { QuoteChart } from '../quoteChart/QuoteChart';
import { QuoteChartTimeFilter } from '../quoteChartTimeFilter/QuoteChartTimeFilter';
import { DataBar } from '../dataBar/DataBar';


export function QuoteContainer() {
    const dispatch = useDispatch();
    const { symbol } = useParams();

    useEffect(() => {
        dispatch(fetchCompanyProfile(symbol));
        dispatch(fetchQuote(symbol));
        dispatch(fetchOHLCV(symbol));
    }, [symbol, dispatch])

    // Update quote every minute
    const updateQuoteFn = () => {
        dispatch(fetchCompanyProfile(symbol));
        dispatch(fetchQuote(symbol));
        dispatch(fetchOHLCV(symbol));
    }

    useEffect(() => {
        const updateQuoteInterval = setInterval(updateQuoteFn, 1000 * 60);
        return () => clearInterval(updateQuoteInterval);
    }, []);

    return(
        <>
            <QuoteHeader symbol={symbol} />
            <QuoteChartTimeFilter />
            <QuoteChart />
            <DataBar />
        </>
    );
}
