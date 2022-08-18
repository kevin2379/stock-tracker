import { rest } from 'msw';
import { setupServer } from 'msw/node';
// import { jest } from '@jest/globals';

const baseURL = 'https://finnhub.io/api/v1';

const server = setupServer(
    rest.get(`${baseURL}/search`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                count: 4,
                result: [
                  {
                    description: "APPLE INC",
                    displaySymbol: "AAPL",
                    symbol: "AAPL",
                    type: "Common Stock"
                  },
                  {
                    description: "APPLE INC",
                    displaySymbol: "AAPL.SW",
                    symbol: "AAPL.SW",
                    type: "Common Stock"
                  },
                  {
                    description: "APPLE INC",
                    displaySymbol: "APC.BE",
                    symbol: "APC.BE",
                    type: "Common Stock"
                  },
                  {
                    description: "APPLE INC",
                    displaySymbol: "APC.DE",
                    symbol: "APC.DE",
                    type: "Common Stock"
                  }
                ]
              })
        )
    }),
    rest.get(`${baseURL}/quote`, (req, res, ctx) => {
        const symbol = req.url.searchParams.get('symbol');
        let quote = {
            c: 261.23,
            d: 25.34,
            dp: 23.34,
            h: 263.85,
            l: 260.68,
            o: 261.25,
            pc: 259.12,
            t: 1582641000,
        }
        if (symbol === 'AAPL') {
            quote.c = 173.89;
            quote.d = -0.63;
        } else if (symbol === 'TSLA') {
            quote.c = 911.91;
            quote.d = 23.24;
        }
        
        return res(
            ctx.status(200),
            ctx.json(quote)
        )
    }),
    rest.get('*', (req, res, ctx) => {
        // Fallback request handler to handle any unrecognized requests.
        console.error(`Please add request handler from ${req.url.toString()}`);
        return res(
            ctx.status(500),
            ctx.json({Error: "Please add request handler"})
        )
    })
)

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// Lock system time: 
// jest.useFakeTimers()
// jest.setSystemTime(new Date('2024-08-08'));

export { server, rest };