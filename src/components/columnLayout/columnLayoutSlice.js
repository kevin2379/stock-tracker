import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    index: 0,
}

export const columnLayoutSlice = createSlice({
    name: 'columnLayout',
    initialState,
    reducers: {
        leftColumn: (state) => {
            state.index = 0;
        },
        rightColumn: (state) => {
            state.index = 1;
        }
    }
})

export const { leftColumn, rightColumn } = columnLayoutSlice.actions;

export const selectColumnLayout = (state) => state.columnLayout;

export default columnLayoutSlice.reducer;