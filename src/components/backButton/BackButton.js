import React from 'react';
import { useDispatch } from 'react-redux';
import {
    leftColumn,
  } from '../columnLayout/columnLayoutSlice';
import leftIcon from '../../icons/chevron-left.svg';

export function BackButton() {
    const dispatch = useDispatch();

    function handleClickBack() {
        dispatch(leftColumn());
    }

    return (
        <div style={{backgroundColor: 'var(--bg-secondary)', width: '20px', height: '20px', padding: '10px', borderRadius: '50%', marginBottom: '10px'}}>
            <img src={leftIcon} onClick={handleClickBack} style={{ transform: 'scale(1.5)', marginTop: '2px'}} alt='back button'></img>
        </div>
    );
}