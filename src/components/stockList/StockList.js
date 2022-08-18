import React from 'react';
import { useSelector } from 'react-redux';
import {
    selectStocks,
  } from './stocksSlice';
import { Stock } from '../stock/Stock';
import { SearchResults } from '../searchResults/SearchResults';
import { useParams } from "react-router-dom";

export function StockList() {
    const stocks = useSelector(selectStocks);
    const { symbol } = useParams();

    // const updateWatchlistPrices = () => {
    //     console.log('Updating watchlist prices!');
    //     stocks.watchlist.forEach((stock) => updateStockPrice(stock.symbol));
    // }

    // useEffect(() => {
    //     console.log('use effect ran');
    //     //updateWatchlistPrices();

    //     const updateWatchlistPricesInterval = setInterval(() => {
    //         // Update prices every minute
    //         updateWatchlistPrices();
    //       }, 1000 * 60);
    //       return () => clearInterval(updateWatchlistPricesInterval);
    // }, []);

    if (!stocks.searchTerm) {
        // When there's no search term entered, display watchlist

        const selectedIndex = stocks.watchlist.data.findIndex((stock) => stock.symbol === symbol);

        return (
            <>
                {stocks.watchlist.data.map((stock, index) => (
                    <Stock 
                        stock={stock} 
                        key={index} 
                        selected={index === selectedIndex}
                        removeBorder={index === selectedIndex + 1}
                    />
                ))}
            </>
        );
    } else {
        // When searchterm is entered, display filtered watchlist and symbol search results
        const filteredWatchlist = stocks.watchlist.data.filter((stock) => {
            return (
                stock.displaySymbol.toLowerCase().includes(stocks.searchTerm.toLowerCase()) || 
                stock.description.toLowerCase().includes(stocks.searchTerm.toLowerCase())
            )
        });
        const selectedIndex = filteredWatchlist.findIndex((stock) => stock.symbol === symbol);

        return (
            <>
                {/* Watchlist */}
                <h2 style={{margin: "20px 0 10px 0"}}>
                    {filteredWatchlist.length > 0 ? "Watchlist" : null}
                </h2>
                {filteredWatchlist.map((stock, index) => (
                    <Stock 
                        stock={stock} 
                        key={index} 
                        selected={index === selectedIndex}
                        removeBorder={index === selectedIndex + 1}
                    />
                ))}

                {/* Symbols */}
                <h2 style={{margin: "20px 0 10px 0"}}>Symbols</h2>
                <SearchResults 
                    filteredWatchlist={filteredWatchlist} 
                    symbol={symbol} 
                />
            </>
            
        )
    }

}