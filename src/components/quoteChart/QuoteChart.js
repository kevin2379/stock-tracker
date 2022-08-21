import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, TimeScale, Tooltip, Title } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useSelector } from 'react-redux';
import {
    selectQuote,
  } from '../quoteContainer/quoteSlice';
import quoteChartStyles from './QuoteChart.module.css';
import chartLoading from '../../icons/chart-loading.svg';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, Title);

export function QuoteChart() {
    const quote = useSelector(selectQuote);

    if (quote.OHLCV.loading) {

        return <img src={chartLoading} className={quoteChartStyles.loading} alt="chart loading"></img>
    } else if (quote.OHLCV.hasError) {
        return <p>Error loading chart</p>
    } else {
        if(typeof quote.OHLCV.data.t !== 'undefined' && typeof quote.OHLCV.data.c !== 'undefined') {
            // Set chart x axis min time based on selected chart time filter
            const chartMax = quote.OHLCV.data.t[quote.OHLCV.data.t.length - 1] * 1000;
            let chartMin = chartMax - (365 * 24 * 60 * 60 * 1000);

            if (quote.chartTimeFilter === '7D') {
                chartMin = chartMax - (7 * 24 * 60 * 60 * 1000);
            } else if (quote.chartTimeFilter === '1M') {
                chartMin = chartMax - (30 * 24 * 60 * 60 * 1000);
            } else if (quote.chartTimeFilter === '3M') {
                chartMin = chartMax - (90 * 24 * 60 * 60 * 1000);
            } else if (quote.chartTimeFilter === '6M') {
                chartMin = chartMax - (180 * 24 * 60 * 60 * 1000);
            } else if (quote.chartTimeFilter === 'YTD') {
                const today = new Date();
                const year = today.getFullYear();
                chartMin = new Date(`January 1, ${year} 00:00:00`);
            } else if (quote.chartTimeFilter === '1Y') {
                chartMin = chartMax - (365 * 24 * 60 * 60 * 1000);
            } else {
                chartMin = chartMax - (365 * 24 * 60 * 60 * 1000);
            }

            const tickSource = quote.chartTimeFilter === '7D' ? 'data' : 'auto';

            const options = {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        min: chartMin,
                        max: chartMax,
                        ticks: {color: '#ffffff', source: tickSource},
                        grid: {color: '#4c4a58', borderColor: '#4c4a58'},
                        time: {unit: 'day'}
                    },
                    y: {
                        type: 'linear',
                        ticks: {color: '#ffffff'},
                        grid: {color: '#4c4a58', borderColor: '#4c4a58'},
                    },
                },
                elements: {
                    point: {
                        radius: 0 // default to disabled in all datasets
                    }
                },
                animation: false,
                showTooltips: true,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    tooltip: {
                    }
                }
            };

            const labels = quote.OHLCV.data.t.map(time => time * 1000);

            const data = {
                labels,
                datasets: [
                {
                    id: 1,
                    label: '',
                    data: quote.OHLCV.data.c,
                    borderColor: 'rgb(209, 59, 59)',
                    backgroundColor: 'rgba(209, 59, 59, 0.7)',
                    borderWidth: 2
                },
                ],
            };
        
            return (
                <Line 
                    data={data} 
                    options={options} 
                />
            );
        } else {
            return <p>OHLCV data does not exist</p>
        }
        
    }
}