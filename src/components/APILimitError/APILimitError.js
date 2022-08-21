import React from "react";
import { useSelector } from 'react-redux';
import {
    selectQuote,
  } from '../quoteContainer/quoteSlice';

export function APILimitError() {
    const quote = useSelector(selectQuote);
    if (quote.APILimitReached) {
        return (
            <div style={{width: '100%', textAlign: 'center', marginBottom: '1rem'}}>
                <p style={{color: 'red', fontWeight: '700'}}>API limit reached! Please try again in one minute.</p>
            </div>
        )
    } else {
        return null;
    }

}