import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchSymbols,
    selectStocks,
    setSearchResultsLoading,
  } from '../stockList/stocksSlice';
import { Stock } from '../stock/Stock';

export function SearchResults({ filteredWatchlist, symbol = '' }) {
    const stocks = useSelector(selectStocks);
    const dispatch = useDispatch();
    // const filteredStockSymbols = stocks.stockSymbols.symbols.filter((stock) => {
    //     return (
    //         true
    //         //stock.description.includes(stock.searchTerm)
    //         // stock.displaySymbol.includes(stock.searchTerm) ||
    //         // stock.symbol.includes(stock.searchTerm)
    //     )
    // });

    //if search term changes, fetch symbols
    useEffect(() => {
        dispatch(setSearchResultsLoading());

        // Wait until user stops typing, then send symbol search request
        const delayDebounceFn = setTimeout(() => {
            dispatch(fetchSymbols(stocks.searchTerm));
        }, 300)
        return () => clearTimeout(delayDebounceFn)
    }, [dispatch, stocks.searchTerm]);

    

    if (stocks.searchResults.hasError) {
        return <p>Error loading stock symbols</p>
    } else if (stocks.searchResults.loading) {
        return (
            // Loading state UI skeleton
            <>
                <Stock isLookup={true} loading={true}/>
                <Stock isLookup={true} loading={true}/>
                <Stock isLookup={true} loading={true}/>
                <Stock isLookup={true} loading={true}/>
                <Stock isLookup={true} loading={true}/>
            </>
        )
    } else if (!stocks.searchResults.loading && stocks.searchResults.results === [] && filteredWatchlist === []) {
        return <p>{`No results for ${stocks.searchTerm}.`}</p>
    } else if (stocks.searchResults.results.count > 0) {
        const filteredSearchResults = stocks.searchResults.results.result.filter((stock) => {
            return (
                // stock in search results is not already in watchlist
                stocks.watchlist.data.filter((item) => item.symbol === stock.symbol).length === 0 &&
                // Stock symbol does not contain a period
                !stock.symbol.includes('.') && 
                // Stock type is not ETP
                stock.type !== 'ETP' && 
                //Stock type is not empty
                stock.type !== ''
            )
        });

        const selectedIndex = filteredSearchResults.findIndex((stock) => stock.symbol === symbol);

        return (
            <>
                {filteredSearchResults.map((stock, index) => (
                    <Stock 
                        stock={stock} 
                        isLookup={true} 
                        key={index}
                        selected={index === selectedIndex}
                        removeBorder={index === selectedIndex + 1}
                    />
                ))}
            </>
        );
    } else {
        return <p>Search results error</p>
    }
}
