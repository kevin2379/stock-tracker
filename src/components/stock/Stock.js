import React from 'react';
import { useDispatch } from 'react-redux';
import {
  rightColumn,
} from '../columnLayout/columnLayoutSlice';
import stockStyles from './Stock.module.css';
import { useNavigate } from "react-router-dom";


export function Stock({ stock, isLookup = false, loading = false, selected = false, removeBorder = false }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleClick() {
        dispatch(rightColumn());
        navigate(`/quote/${stock.symbol}`);
    }


    if (loading) {
        return (
            <div className={stockStyles.container}>
            <div className={stockStyles.ticker + ' ' + stockStyles.tickerLoading}>
            </div>
            <div className={stockStyles.companyName + ' ' + stockStyles.companyNameLoading}>
            </div>
        </div>
        )
    } else {
        const displaySymbol = typeof stock.displaySymbol === 'string' ? stock.displaySymbol : null;
        const companyName = () => {
            if (typeof stock.description === 'string') {
                // Shorten stock descriptions that are too long
                return stock.description.length < 30 ? stock.description.toLowerCase() : stock.description.toLowerCase().slice(0,27).trim() + "..."
            } else {
                return null
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