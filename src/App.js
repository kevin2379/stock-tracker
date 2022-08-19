import React, { useEffect } from 'react';
import './App.css';
import { Header } from './components/header/Header';
import { StockList } from './components/stockList/StockList';
import { Search } from './components/search/Search';
import { ColumnLayout } from './components/columnLayout/ColumnLayout';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QuoteContainer } from './components/quoteContainer/QuoteContainer';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectStocks,
    updateWatchlistPrices,
  } from './components/stockList/stocksSlice';
//import { server } from './testServer';

function App() {
  const stocks = useSelector(selectStocks);
  const dispatch = useDispatch();

  const updateWatchlistPricesFn = () => {
    dispatch(updateWatchlistPrices(stocks.watchlist.data));
  }

  useEffect(() => {
    updateWatchlistPricesFn();

    // Update prices every minute
    const updateWatchlistPricesInterval = setInterval(updateWatchlistPricesFn, 1000 * 60);

    //run mock service worker for testing
    //server.listen();

    return () => clearInterval(updateWatchlistPricesInterval);
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' exact element={<Navigate to='/quote/AAPL'></Navigate>} /> {/* News to come later. For now redirects to apple stock quote */}
        <Route path='/quote' exact element={<Navigate to='/quote/AAPL'></Navigate>} /> {/* Will later redirect to '/' when there's general news. For now redirects to apple stock quote */}
        <Route path='/quote/:symbol' element={
          <ColumnLayout 
            leftColumn={
              <>
                <Search />
                <StockList />
              </>
            }
            rightColumn={
              <>
                <QuoteContainer />
              </>
            }
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;
