import { createSlice as toolkitCreateSlice } from '@reduxjs/toolkit';
import * as C from './constants';

const createSlice = (name, insertDirection, dependenciesFunction) => {
    insertDirection = insertDirection || C.INSERT_DIRECTION_BOTTOM;
    dependenciesFunction = dependenciesFunction || (deps => JSON.stringify(deps));

    return {
        slice: toolkitCreateSlice({
            name,
            initialState: {
                items: [],
                dependencies: null,
                status: C.STATUS_INIT,
            },
            reducers: {
                startLoading: state => {
                    state.status = C.STATUS_LOADING;
                },
                setError: (state, { payload }) => {
                    state.status = C.ERRORS_STATUSES.indexOf(payload) !== -1 ? payload : C.STATUS_ERROR_UNKNOWN;
                },
                setItems: (state, { payload }) => {
                    state.items = payload.data;
                    state.dependencies = dependenciesFunction(payload.deps);
                    state.status = C.STATUS_OK;
                },
                addItem: (state, { payload }) => {
                    if (insertDirection === C.INSERT_DIRECTION_TOP) {
                        state.items.unshift(payload);
                    } else {
                        state.items.push(payload);
                    }
                    state.status = C.STATUS_OK;
                },
                editItem: (state, { payload }) => {
                    const index = state.items.findIndex(item => item.id === payload.id);
                    index > -1 && (state.items[index] = payload);
                },
                deleteItem: (state, { payload }) => {
                    const index = state.items.findIndex(item => item.id === payload);
                    index > -1 && state.items.splice(index, 1);
                },
            },
        }),

        selectors: {
            getAll: state => state[name].items,

            getById: id => state => (
                state[name].items.find(obj => obj.id === id.toString())
            ),

            getStatus: state => ({
                hasError: C.ERRORS_STATUSES.indexOf(state[name].status) !== -1,
                isLoading: state[name].status === C.STATUS_LOADING,
                isReady: state[name].status === C.STATUS_OK,
            }),
        },
    };
};

export default createSlice;
