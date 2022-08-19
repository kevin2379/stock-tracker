import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import { unmountComponentAtNode } from "react-dom";
import { Stock } from './Stock';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from "react-router-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders loading state', () => {
    act(() => {
        render(
            <Provider store={store}>
                <Router>
                    <Stock loading={true} />
                </Router>
            </Provider>
        , container);
    });

    expect(screen.getByTestId('ticker-loading')).toBeVisible();
    expect(screen.getByTestId('company-name-loading')).toBeVisible();
})

it('renders stock with default error value when no stock data provided', async () => {
    act(() => {
        render(
            <Provider store={store}>
                <Router>
                    <Stock />
                </Router>
            </Provider>
        , container);
    });

    expect(await screen.findByText('ERR')).toBeVisible();
    expect(await screen.findByText('error loading stock')).toBeVisible();
})

it('renders stock with provided data', async () => {
    const stock = {
        description: 'Shopify Inc.',
        displaySymbol: 'SHOP',
        symbol: 'SHOP',
        type: 'Common Stock',
        quote: {
            c: 171.53,
            d: -2.61,
            dp: -1.50,
            h: 173.74,
            l: 171.38,
            o: 173.03,
            pc: 174.15,
            t: 1660938426,
        }
    }
    act(() => {
        render(
            <Provider store={store}>
                <Router>
                    <Stock stock={stock} />
                </Router>
            </Provider>
        , container);
    });

    expect(await screen.findByText('SHOP')).toBeVisible();
    expect(await screen.findByText('shopify inc.')).toBeVisible();
    expect(await screen.findByText('171.53')).toBeVisible();
    expect(await screen.findByText('-2.61')).toBeVisible();
})

it('does not render price or daily change when it is a stock lookup', async () => {
    const stock = {
        description: 'Shopify Inc.',
        displaySymbol: 'SHOP',
        symbol: 'SHOP',
        type: 'Common Stock',
        quote: {
            c: 171.53,
            d: -2.61,
            dp: -1.50,
            h: 173.74,
            l: 171.38,
            o: 173.03,
            pc: 174.15,
            t: 1660938426,
        }
    }
    act(() => {
        render(
            <Provider store={store}>
                <Router>
                    <Stock stock={stock} isLookup={true} />
                </Router>
            </Provider>
        , container);
    });

    expect(await screen.findByText('SHOP')).toBeVisible();
    expect(await screen.findByText('shopify inc.')).toBeVisible();
    expect(screen.queryByText('171.53')).not.toBeInTheDocument();
    expect(screen.queryByText('-2.61')).not.toBeInTheDocument();
})