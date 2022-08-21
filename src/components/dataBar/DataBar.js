import React from 'react';
import { useSelector } from 'react-redux';
import { selectQuote } from '../quoteContainer/quoteSlice';
import dataBarStyles from './DataBar.module.css';
import Tooltip from '@mui/material/Tooltip';

export function DataBar() {
    const quote = useSelector(selectQuote);

    if (quote.companyProfile.loading || quote.quote.loading || quote.OHLCV.loading) {
        //quote.companyProfile.loading || quote.quote.loading || quote.OHLCV.loading
        return (
            <div className={dataBarStyles.outerContainer}>
            <div className={dataBarStyles.container}>
                <div style={{gridColumn: '1 / span 1', gridRow: '1 / span 1'}}>
                    <table style={{width: '100%'}}>
                        <tbody style={{width: '100%'}}>
                            <tr>
                                <td className={dataBarStyles.key}>Open</td>
                                <td className={dataBarStyles.value}><span className={dataBarStyles.valueLoading}></span></td>
                            </tr>
                            <tr>
                                <td className={dataBarStyles.key}>High</td>
                                <td className={dataBarStyles.value}><span className={dataBarStyles.valueLoading}></span></td>
                            </tr>
                            <tr>
                                <td className={dataBarStyles.key}>Low</td>
                                <td className={dataBarStyles.value}><span className={dataBarStyles.valueLoading}></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Spacer */}
                <div style={{gridColumn: '2 / span 1', gridRow: '1 / span 1'}}>
                    <div className={dataBarStyles.spacer}></div>
                </div>

                <div style={{gridColumn: '3 / span 1', gridRow: '1 / span 1'}}>
                    <table style={{width: '100%'}}>
                        <tbody style={{width: '100%'}}>
                            <tr>
                                <td className={dataBarStyles.key}>Vol</td>
                                <td className={dataBarStyles.value}><span className={dataBarStyles.valueLoading}></span></td>
                            </tr>
                            <tr>
                                <td className={dataBarStyles.key}>Shares</td>
                                <td className={dataBarStyles.value}><span className={dataBarStyles.valueLoading}></span></td>
                            </tr>
                            <tr>
                                <td className={dataBarStyles.key}>Mkt Cap</td>
                                <td className={dataBarStyles.value}><span className={dataBarStyles.valueLoading}></span></td>
                            </tr>
                        </tbody>
                    </table>                    
                </div>

                {/* Spacer */}
                <div style={{gridColumn: '4 / span 1', gridRow: '1 / span 1'}}>
                    <div className={dataBarStyles.spacer}></div>
                </div>

                <div style={{gridColumn: '5 / span 1', gridRow: '1 / span 1'}}>
                    <table style={{width: '100%'}}>
                        <tbody style={{width: '100%'}}>
                            <tr>
                                <td className={dataBarStyles.key}>52W H</td>
                                <td className={dataBarStyles.value}><span className={dataBarStyles.valueLoading}></span></td>
                            </tr>
                            <tr>
                                <td className={dataBarStyles.key}>52W L</td>
                                <td className={dataBarStyles.value}><span className={dataBarStyles.valueLoading}></span></td>
                            </tr>
                            <tr>
                                <td className={dataBarStyles.key}>
                                    <span>Avg Vol</span>
                                </td>
                                <td className={dataBarStyles.value}><span className={dataBarStyles.valueLoading}></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        )
    } else if (quote.companyProfile.hasError || quote.quote.hasError || quote.OHLCV.hasError) {
        return <p>Error loading data</p>
    } else {
        const open = typeof quote.quote.data.o !== 'undefined' ? quote.quote.data.o.toFixed(2) : '-';
        const high = typeof quote.quote.data.h !== 'undefined' ? quote.quote.data.h.toFixed(2) : '-';
        const low = typeof quote.quote.data.l !== 'undefined' ? quote.quote.data.l.toFixed(2) : '-';

        const vol = () => {
            if (typeof quote.OHLCV.data.v !== 'undefined') {
                const volValue = quote.OHLCV.data.v[quote.OHLCV.data.v.length - 1];
                let volFormatted = volValue.toFixed(0);
                if (volValue > 1000000) {
                    volFormatted = (volValue / 1000000).toFixed(2) + 'M'
                }
                return volFormatted;
            } else {
                console.log('Error: OHLCV volume data does not exist');
                return '-';
            }
        }

        const shares = () => {
            if (typeof quote.companyProfile.data.shareOutstanding !== 'undefined') {
                const sharesValue = quote.companyProfile.data.shareOutstanding * 1000000;
                let sharesFormatted = sharesValue.toFixed(0);
                if (sharesValue < 1000000000) {
                    sharesFormatted = (sharesValue / 1000000).toFixed(2) + 'M'
                } else if (sharesValue < 1000000000000) {
                    sharesFormatted = (sharesValue / 1000000000).toFixed(2) + 'B'
                } else {
                    sharesFormatted = (sharesValue / 1000000000000).toFixed(2) + 'T'
                }
                return sharesFormatted;
            } else {
                console.log('Error: shares outstanding data does not exist');
                return '-';
            }
        }
        const mktCap = () => {
            if (typeof quote.companyProfile.data.marketCapitalization !== 'undefined') {
                if (typeof quote.companyProfile.data.marketCapitalization === 'number') {
                    const mktCapValue = quote.companyProfile.data.marketCapitalization * 1000000;
                    let mktCapFormated = '';
                    if (mktCapValue < 1000000000) {
                        mktCapFormated = (mktCapValue / 1000000).toFixed(2) + 'M'
                    } else if (mktCapValue < 1000000000000) {
                        mktCapFormated = (mktCapValue / 1000000000).toFixed(2) + 'B'
                    } else {
                        mktCapFormated = (mktCapValue / 1000000000000).toFixed(2) + 'T'
                    }
                    return mktCapFormated;
                } else {
                    console.log('mktCap error: not a number')
                    return '-';
                }
            } else {
                console.log('mktCap error: data does not exist')
                return '-';
            }
        }
        const yearHigh = () => {
            if (typeof quote.OHLCV.data.c !== 'undefined') {
                const pricesArray = quote.OHLCV.data.c;
                const maxValue = Math.max(...pricesArray).toFixed(2);
                return maxValue;
            } else {
                console.log('Error: OHLCV price data does not exist in yearHigh function');
                return '-';
            }
        }
        const yearLow = () => {
            if (typeof quote.OHLCV.data.c !== 'undefined') {
                const pricesArray = quote.OHLCV.data.c;
                const minValue = Math.min(...pricesArray).toFixed(2);
                return minValue;
            } else {
                console.log('Error: OHLCV price data does not exist in yearHigh function');
                return '-';
            }
        }
        const avgVol = () => {
            if (typeof quote.OHLCV.data.v !== 'undefined') {
                const volArray = quote.OHLCV.data.v;
                let thirtyDaySum = 0;
                for (let i = volArray.length - 1; i > volArray.length - 31; i--) {
                    thirtyDaySum += volArray[i];
                }
                const thirtyDayAvg = thirtyDaySum / 30;

                let avgVolFormatted = thirtyDayAvg.toFixed(0);
                if (thirtyDayAvg > 1000000) {
                    avgVolFormatted = (thirtyDayAvg / 1000000).toFixed(2) + 'M'
                }
                return avgVolFormatted;
            } else {
                console.log('Error: OHLCV volume data does not exist in avgVol function');
                return '-';
            }
        }

        return(
            <div className={dataBarStyles.outerContainer}>
                <div className={dataBarStyles.container}>
                    <div style={{gridColumn: '1 / span 1', gridRow: '1 / span 1'}}>
                        <table style={{width: '100%'}}>
                            <tbody style={{width: '100%'}}>
                                <tr>
                                    <td className={dataBarStyles.key}>Open</td>
                                    <td className={dataBarStyles.value}>{open}</td>
                                </tr>
                                <tr>
                                    <td className={dataBarStyles.key}>High</td>
                                    <td className={dataBarStyles.value}>{high}</td>
                                </tr>
                                <tr>
                                    <td className={dataBarStyles.key}>Low</td>
                                    <td className={dataBarStyles.value}>{low}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Spacer */}
                    <div style={{gridColumn: '2 / span 1', gridRow: '1 / span 1'}}>
                        <div className={dataBarStyles.spacer}></div>
                    </div>

                    <div style={{gridColumn: '3 / span 1', gridRow: '1 / span 1'}}>
                        <table style={{width: '100%'}}>
                            <tbody style={{width: '100%'}}>
                                <tr>
                                    <td className={dataBarStyles.key}>Vol</td>
                                    <td className={dataBarStyles.value}>{vol()}</td>
                                </tr>
                                <tr>
                                    <td className={dataBarStyles.key}>Shares</td>
                                    <td className={dataBarStyles.value}>{shares()}</td>
                                </tr>
                                <tr>
                                    <td className={dataBarStyles.key}>Mkt Cap</td>
                                    <td className={dataBarStyles.value}>{mktCap()}</td>
                                </tr>
                            </tbody>
                        </table>                    
                    </div>

                    {/* Spacer */}
                    <div style={{gridColumn: '4 / span 1', gridRow: '1 / span 1'}}>
                        <div className={dataBarStyles.spacer}></div>
                    </div>

                    <div style={{gridColumn: '5 / span 1', gridRow: '1 / span 1'}}>
                        <table style={{width: '100%'}}>
                            <tbody style={{width: '100%'}}>
                                <tr>
                                    <td className={dataBarStyles.key}>52W H</td>
                                    <td className={dataBarStyles.value}>{yearHigh()}</td>
                                </tr>
                                <tr>
                                    <td className={dataBarStyles.key}>52W L</td>
                                    <td className={dataBarStyles.value}>{yearLow()}</td>
                                </tr>
                                <tr>
                                    <td className={dataBarStyles.key}>
                                        <Tooltip title="The average number of shares traded each day over the past 30 days">
                                            <span>Avg Vol</span>
                                        </Tooltip>
                                    </td>
                                    <td className={dataBarStyles.value}>{avgVol()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}