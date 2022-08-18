import React from 'react';
import { useDispatch } from 'react-redux';
import {
    leftColumn,
  } from '../columnLayout/columnLayoutSlice';
import leftIcon from '../../icons/chevron-left.svg';
import Tooltip from '@mui/material/Tooltip';

export function BackButton() {
    const dispatch = useDispatch();

    function handleClickBack() {
        dispatch(leftColumn());
    }

    return (
        <Tooltip title="Back" >
            <img src={leftIcon} onClick={handleClickBack} style={{ transform: 'scale(1.5)', marginBottom: '10px' }} alt='back button'></img>
        </Tooltip>
    );
}