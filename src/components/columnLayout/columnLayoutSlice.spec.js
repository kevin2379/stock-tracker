import columnLayoutReducer, {
    leftColumn, 
    rightColumn
} from './columnLayoutSlice';

describe('column layout reducer', () => {
    const initialState = {
        index: 0,
    };
    it ('should handle initial state', () => {
        expect(columnLayoutReducer(undefined, { type: 'unknown' })).toEqual({
            index: 0,
        });
    });
    it('should handle rightColumn', () => {
        const actual = columnLayoutReducer(initialState, rightColumn());
        expect(actual.index).toEqual(1);
    });
    it('should handle leftColumn', () => {
        const actual = columnLayoutReducer(initialState, leftColumn());
        expect(actual.index).toEqual(0);
    });
})