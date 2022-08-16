import React from 'react';
import headerStyles from './Header.module.css';
import Logo from '../../icons/logo.svg';

export function Header() {
    return (
        <div className={headerStyles.container}>
            <img src={Logo} alt="Stock tracker logo"></img>
            <div className={headerStyles.appName}>Stock Tracker</div>
        </div>
    );
}