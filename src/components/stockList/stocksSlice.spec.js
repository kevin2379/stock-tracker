import stocksReducer, {
    setSearchTerm, 
    setSearchResultsLoading, 
    addToWatchlist,
} from './stocksSlice';

describe('stocks reducer', () => {
    const initialState = {
        searchTerm: '',
        watchlist: {
            loading: false, 
            hasError: false, 
            data: [
                {
                    description: "APPLE INC",
                    displaySymbol: "AAPL",
                    symbol: "AAPL",
                    type: "Common Stock",
                    quote: {
                        c: 261.74,
                        h: 263.31,
                        l: 260.68,
                        o: 261.07,
                        pc: 3.45,
                        t: 1582641000 
                    },
                },
                {
                    description: "TESLA INC",
                    displaySymbol: "TSLA",
                    symbol: "TSLA",
                    type: "Common Stock",
                    quote: {
                        c: 261.75,
                        h: 263.31,
                        l: 260.68,
                        o: 261.07,
                        pc: -234,
                        t: 1582641000 
                    },
                },
            ]
        },
        searchResults: {
            loading: true,
            hasError: false, 
            results: {}
        }, 
    };

    it('should handle initial state', () => {
        expect(stocksReducer(undefined, { type: 'unknown' })).toEqual({
            searchTerm: '',
            watchlist: {
                loading: false, 
                hasError: false, 
                data: [
                    {
                        description: "APPLE INC",
                        displaySymbol: "AAPL",
                        symbol: "AAPL",
                        type: "Common Stock",
                        quote: {
                            c: 261.74,
                            h: 263.31,
                            l: 260.68,
                            o: 261.07,
                            pc: 3.45,
                            t: 1582641000 
                        },
                    },
                    {
                        description: "TESLA INC",
                        displaySymbol: "TSLA",
                        symbol: "TSLA",
                        type: "Common Stock",
                        quote: {
                            c: 261.75,
                            h: 263.31,
                            l: 260.68,
                            o: 261.07,
                            pc: -234,
                            t: 1582641000 
                        },
                    },
                ]
            },
            searchResults: {
                loading: true,
                hasError: false, 
                results: {}
            }, 
        });
    });
    it('should handle setSearchTerm', () => {
        const actual = stocksReducer(initialState, setSearchTerm('new term'));
        expect(actual.searchTerm).toEqual('new term');
    });
    it('should handle setSearchResultsLoading', () => {
        const actual = stocksReducer(initialState, setSearchResultsLoading());
        expect(actual.searchResults.loading).toEqual(true);
    });
    it('should handle addToWatchlist', () => {
        const actual = stocksReducer(initialState, addToWatchlist({
            description: "Shopify Inc",
            displaySymbol: "SHOP",
            symbol: "SHOP",
            quote: {
                c:37.93,
                d:-1.65,
                dp:-4.1688,
                h:39.015,
                l:37.7,
                o:38.75,
                pc:39.58,
                t:1660745724,
            }
        }));
        expect(actual.watchlist.data[2]).toEqual({
            description: "Shopify Inc",
            displaySymbol: "SHOP",
            symbol: "SHOP",
            quote: {
                c:37.93,
                d:-1.65,
                dp:-4.1688,
                h:39.015,
                l:37.7,
                o:38.75,
                pc:39.58,
                t:1660745724,
            }
        });
    });
});
