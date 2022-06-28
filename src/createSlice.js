import { createSlice as toolkitCreateSlice } from '@reduxjs/toolkit';
import { dependenciesFunc } from './common';
import * as C from './constants';

const createSlice = (name, {
    fetchFunc,
    checkAuthFunc = () => true,
}, insertDirection = C.INSERT_DIRECTION_BOTTOM) => {

    const slice = toolkitCreateSlice({
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
                state.dependencies = dependenciesFunc(payload.deps);
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
            reset: state => {
                state.items = [];
                state.dependencies = null;
                state.status = C.STATUS_INIT;
            },
        },
    });

    const loadItems = (deps = {}) => async (dispatch, getState) => {
        const state = getState();

        if (state[name].status === C.STATUS_LOADING) {
            return;
        }

        dispatch(slice.actions.startLoading());

        if (!checkAuthFunc(state)) {
            dispatch(slice.actions.setError(C.STATUS_ERROR_AUTH));
            return;
        }

        try {
            const data = await fetchFunc(deps);
            dispatch(slice.actions.setItems({data, deps}));
        } catch (error) {
            dispatch(slice.actions.setError(C.STATUS_ERROR_READ));
        }
    };

    return {
        slice: slice,

        selectors: {
            getAll: state => state[name].items,

            getById: id => state => (id
                ? state[name].items.find(obj => obj.id === id.toString())
                : undefined
            ),

            getStatus: (deps = {}) => state => ({
                hasError: C.ERRORS_STATUSES.indexOf(state[name].status) !== -1,
                isLoading: state[name].status === C.STATUS_LOADING,
                isReady: state[name].status === C.STATUS_OK && state[name].dependencies === dependenciesFunc(deps),
            }),
        },

        thunks: {
            loadItems,
        },
    };
};

export default createSlice;
