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
        <div 
            onClick={handleClickBack} 
            style={{
                backgroundColor: 'var(--bg-secondary)', 
                width: '24px', 
                height: '24px', 
                padding: '10px', 
                borderRadius: '50%', 
                marginBottom: '10px'
            }}
        >
            <img 
                src={leftIcon} 
                style={{ transform: 'scale(1.5)', marginTop: '4px', marginLeft: '2px'}} 
                alt='back button'
            ></img>
        </div>
    );
}