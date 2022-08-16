import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setSearchTerm,
    selectStocks,
  } from '../stockList/stocksSlice';

import searchStyles from './Search.module.css';

export function Search() {
    const stocks = useSelector(selectStocks);
    const dispatch = useDispatch();

    return (
        <form className={searchStyles.inline} >
            <i className={searchStyles.icon}></i>
            <input 
                className={searchStyles.inputField} 
                type="search" 
                placeholder='Search'
                value={stocks.searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            ></input>
        </form>
    );
}