import React from 'react';
import { useDispatch } from 'react-redux';
import {
  rightColumn,
} from '../columnLayout/columnLayoutSlice';
import stockStyles from './Stock.module.css';
import { useNavigate } from "react-router-dom";

const defaultStock = {
    description: 'Error loading stock',
    displaySymbol: 'ERR',
    symbol: 'ERR',
    type: '',
    quote: {
        c: 0,
        d: 0,
        dp: 0,
        h: 0,
        l: 0,
        o: 0,
        pc: 0,
        t: 0,
    }
}


export function Stock({ stock = defaultStock, isLookup = false, loading = false, selected = false, removeBorder = false }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleClick() {
        dispatch(rightColumn());
        navigate(`/quote/${stock.symbol}`);
    }


    if (loading) {
        return (
            <div className={stockStyles.container}>
            <div className={stockStyles.ticker + ' ' + stockStyles.tickerLoading} data-testid='ticker-loading'>
            </div>
            <div className={stockStyles.companyName + ' ' + stockStyles.companyNameLoading} data-testid='company-name-loading'>
            </div>
        </div>
        )
    } else {
        const displaySymbol = typeof stock.displaySymbol !== 'undefined' ? stock.displaySymbol : '';
        const companyName = () => {
            if (typeof stock.description !== 'undefined') {
                // Shorten stock descriptions that are too long
                return stock.description.length < 30 ? stock.description.toLowerCase() : stock.description.toLowerCase().slice(0,27).trim() + "..."
            } else {
                return ''
            }
        }
        // Handling missing data without crashing
        let price = null;
        let dailyChange = null;
        let dailyChangeSetColor = '';
        if (!isLookup) {
            price = typeof stock.quote.c === 'number' ? stock.quote.c.toFixed(2) : null;
            dailyChange = typeof stock.quote.d === 'number' ? stock.quote.d.toFixed(2) : null;

            // Set class to change number color
            if (dailyChange > 0) {
                dailyChangeSetColor = 'number-positive';
            } else if (dailyChange < 0) {
                dailyChangeSetColor = 'number-negative';
            } else {
                dailyChangeSetColor = 'number-neutral';
            }
        }

        return (
            <div 
                className={stockStyles.container + ' ' + (selected ? stockStyles.selected : '') + ' ' + (removeBorder ? stockStyles.removeBorder : '')} 
                onClick={handleClick}
                role="button" 
                name={displaySymbol}
            >
                <div className={stockStyles.ticker}>
                    {displaySymbol}
                </div>
                <div className={stockStyles.companyName}>
                    {companyName()}
                </div>
                <div className={stockStyles.price}>
                    {isLookup ? null : price}
                </div>
                <div className={stockStyles.variableInfo + ' ' + dailyChangeSetColor}>
                    {isLookup ? null : dailyChange}
                </div>
            </div>
        );
    }
}