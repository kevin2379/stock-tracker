import React from "react";
import quoteChartTimeFilterStyles from './QuoteChartTimeFilter.module.css';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectQuote,
    setChartTimeFilter,
  } from '../quoteContainer/quoteSlice';

export function QuoteChartTimeFilter() {
    const quote = useSelector(selectQuote);
    const dispatch = useDispatch();

    const buttonOptions = ['7D', '1M', '3M', '6M', 'YTD', '1Y'];

    // 7D, 1M, 3M, 6M, YTD, 1Y
    return (
        <div className={quoteChartTimeFilterStyles.container}>
            {buttonOptions.map((option, index) => {
                const activeButtonClass = option === quote.chartTimeFilter ? ' ' + quoteChartTimeFilterStyles.buttonActive : '';
                return (
                    <button 
                        className={quoteChartTimeFilterStyles.button + activeButtonClass}
                        onClick={() => dispatch(setChartTimeFilter(option))}
                        key={index}
                    >
                        {option}
                    </button>
                )
            })}
        </div>
    );
}