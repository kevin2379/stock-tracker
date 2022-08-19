import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { act } from 'react-dom/test-utils';
import { unmountComponentAtNode } from "react-dom";
import userEvent from '@testing-library/user-event';
import { server, rest } from './testServer';

const baseURL = 'https://finnhub.io/api/v1';

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

it('renders without crashing', () => {
  act(() => {
    render(
    <Provider store={store}>
      <App />
    </Provider>)
    , container;
  });
});

it('renders logo', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getByRole("img", {name: "Stock tracker logo"})).toBeInTheDocument();
  expect(getByText(/stock tracker/i)).toBeInTheDocument();
});

it('renders search input', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getByRole("searchbox")).toBeInTheDocument();
});

it('renders default watchlist stocks', async () => {
  const { getByText, getAllByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Apple uses getAll because the values should be in the stock list as well as quote display when app first loads
  expect(getAllByText('AAPL')[0]).toBeInTheDocument(); // Ticker
  expect(getAllByText(/apple inc/i)[0]).toBeInTheDocument(); // Company Name
  expect(await screen.findByText('173.89')).toBeVisible(); // Price
  expect(await screen.findByText('-0.63')).toBeVisible(); // Daily Change

  // Tesla should be in stock list only
  expect(getByText(/TSLA/i)).toBeInTheDocument(); // Ticker
  expect(getByText(/tesla inc/i)).toBeInTheDocument(); // Company Name
  expect(await screen.findByText('911.91')).toBeVisible(); // Price
  expect(await screen.findByText('23.24')).toBeVisible(); // Daily Change
});

it('Searches available stocks', async () => {
  const user = userEvent.setup();
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await user.type(screen.getByRole("searchbox"), 'shop');

  expect(await screen.findByText(/shopify inc/i)).toBeVisible(); // Company name
  expect(await screen.findByText('SHOP')).toBeVisible(); // Ticker
  expect(await screen.findByText(/shi corp/i)).toBeVisible(); // Company name
  expect(await screen.findByText('SHCC')).toBeVisible(); // Ticker
  //Stock ticker with decimal filtered out:
  expect(screen.queryByText(/fsbh corp/i)).not.toBeInTheDocument();
  expect(screen.queryByText('FSBH')).not.toBeInTheDocument();
})

it ('Displays stock quote when selected', async () => {
  const user = userEvent.setup();
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const SHOPStock = await screen.findByText(/shopify inc/i);
  await user.click(SHOPStock);

  expect(await screen.findByText(/shopify inc/i)).toBeVisible(); // Company name
  expect(await screen.findByText(/NEW YORK STOCK EXCHANGE, INC./i)).toBeVisible(); // Exchange
  expect(await screen.findByText(/USD/i)).toBeVisible(); // Currency
  expect(await screen.findByText('34.82')).toBeVisible(); // Price
  expect(await screen.findByText('-2.04')).toBeVisible(); // Day change
  expect(await screen.findByText(/Add to Watchlist/i)).toBeVisible(); // Add button
})

it('renders quote chart time filter buttons', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(await screen.findByText('7D')).toBeVisible();
  expect(await screen.findByText('1M')).toBeVisible();
  expect(await screen.findByText('3M')).toBeVisible();
  expect(await screen.findByText('6M')).toBeVisible();
  expect(await screen.findByText('YTD')).toBeVisible();
  expect(await screen.findByText('1Y')).toBeVisible();
})

it('handles API failure when loading search results', async () => {
  server.use(
    rest.get(`${baseURL}/search`, (req, res, ctx) => {
      return res(ctx.status(404));
    })
  )

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(await screen.findByText('Error loading stock symbols')).toBeVisible();
})

it('handles API failure when loading company profile', async () => {
  server.use(
    rest.get(`${baseURL}/stock/profile2`, (req, res, ctx) => {
      return res(ctx.status(404));
    })
  )

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(await screen.findByText('Sorry, this stock could not be found.')).toBeVisible();
})

it('handles API failure when loading quote', async () => {
  server.use(
    rest.get(`${baseURL}/quote`, (req, res, ctx) => {
      return res(ctx.status(404));
    })
  )

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(await screen.findByText('Sorry, this stock could not be found.')).toBeVisible();
})

it('handles API failure when loading OHLCV chart data', async () => {
  server.use(
    rest.get(`${baseURL}/stock/candle`, (req, res, ctx) => {
      return res(ctx.status(404));
    })
  )

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(await screen.findByText('Error loading chart')).toBeVisible();
})