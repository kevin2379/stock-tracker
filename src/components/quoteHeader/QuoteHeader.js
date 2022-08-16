import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
    selectQuote,
  } from '../quoteContainer/quoteSlice';
import quoteHeaderStyles from './QuoteHeader.module.css';
import { WatchlistAddButton } from "../watchlistAddButton/WatchlistAddButton";

export function QuoteHeader({ symbol }) {
    const quote = useSelector(selectQuote);
    const dispatch = useDispatch();

    const loading = quote.companyProfile.loading || quote.quote.loading;
    const hasError = quote.companyProfile.hasError || quote.quote.hasError;

    if (loading) {
        return (
            <div className={quoteHeaderStyles.container}>
                <div className={quoteHeaderStyles.firstRowContainer}>
                    <div className={quoteHeaderStyles.tickerName}>
                        <div className={quoteHeaderStyles.tickerLoading + ' ' + quoteHeaderStyles.loading}></div>
                        <div className={quoteHeaderStyles.companyNameLoading + ' ' + quoteHeaderStyles.loading}></div>
                    </div>
                    <div className={quoteHeaderStyles.priceChange}>
                        <div className={quoteHeaderStyles.priceLoading + ' ' + quoteHeaderStyles.loading}></div>
                        <div className={quoteHeaderStyles.dayChangeLoading + ' ' + quoteHeaderStyles.loading}></div>
                    </div>
                </div>
                <span className={quoteHeaderStyles.exchangeCurrencyLoading + ' ' + quoteHeaderStyles.loading}></span>
            </div>
        );
    } else if (hasError) {
        return <p>Sorry, this stock could not be found.</p>
    } else {
        // Protect against crash in case of missing data
        const companyName = typeof quote.companyProfile.data.name === 'string' ? quote.companyProfile.data.name : null;
        const price = typeof quote.quote.data.c === 'number' ? quote.quote.data.c.toFixed(2) : null;
        const dayChange = typeof quote.quote.data.d === 'number' ? quote.quote.data.d.toFixed(2) : null;
        const exchange = typeof quote.companyProfile.data.exchange === 'string' ? quote.companyProfile.data.exchange : null;
        const currency = typeof quote.companyProfile.data.currency === 'string' ? quote.companyProfile.data.currency : null;

        let dailyChangeSetColor = '';
        // Set class to change number color
        if (dayChange > 0) {
            dailyChangeSetColor = 'number-positive';
        } else if (dayChange < 0) {
            dailyChangeSetColor = 'number-negative';
        } else {
            dailyChangeSetColor = 'number-neutral';
        }

        return(
            <div className={quoteHeaderStyles.container}>
                <div className={quoteHeaderStyles.firstRowContainer}>
                    <div className={quoteHeaderStyles.tickerName}>
                        <div className={quoteHeaderStyles.ticker}>{symbol}</div>
                        <div className={quoteHeaderStyles.companyName}>{companyName}</div>
                    </div>
                    <div className={quoteHeaderStyles.priceChange}>
                        <div className={quoteHeaderStyles.price}>{price}</div>
                        <div className={quoteHeaderStyles.dayChange + ' ' + dailyChangeSetColor}>{dayChange}</div>
                        <div className={quoteHeaderStyles.addButton}>
                            <WatchlistAddButton symbol={symbol} />
                        </div>
                    </div>
                </div>
                <span className={quoteHeaderStyles.exchangeCurrency}>{`${exchange} · ${currency}`}</span>
            </div>
        );
    }

}