import React from 'react';
import { createRoot } from 'react-dom/client';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { act } from 'react-dom/test-utils';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('renders without crashing', () => {
  act(() => {
    createRoot(container).render(
    <Provider store={store}>
      <App />
    </Provider>);
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
  expect(getAllByText('AAPL')[0]).toBeInTheDocument();
  expect(getAllByText(/apple inc/i)[0]).toBeInTheDocument();

  // Tesla should be in stock list only
  expect(getByText(/TSLA/i)).toBeInTheDocument();
  expect(getByText(/tesla inc/i)).toBeInTheDocument();
});