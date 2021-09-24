# redux-rest-crud
Wrapper for Redux Slice with CRUD operations over Rest API.

> The library is in development so interfaces may change: do not use in production!

## Usage

```javascript
import {
    createSlice,
    // import some constants if needed 
    STATUS_LOADING,
    STATUS_OK,
    STATUS_ERROR_AUTH,
    STATUS_ERROR_READ,
    STATUS_ERROR_WRITE,
    STATUS_ERROR_UNKNOWN,
    ERRORS_STATUSES,
} from '@hbsolutions/redux-rest-crud';

export const {
    slice: myEntitySlice,
    // extract the selectors you need
    selectors: { getAll, getById, getStatus }
} = createSlice('myEntities');

// extract the necessary actions for use in thunks or elsewhere
export const { startLoading, setItems, setError, addItem, editItem, deleteItem } = myEntitySlice.actions;

// export reducer to configure the store
export default myEntitySlice.reducer;
```

Thunk example:
```javascript
export const loadMyEntities = () => {
    return async (dispatch, getState) => {
        const state = getState();

        if (state.myEntities.status === STATUS_LOADING) {
            return;
        }

        dispatch(startLoading());

        // Check auth if needed
        if (!isAuthSuccess()) {
            dispatch(setError(STATUS_ERROR_AUTH));
            return;
        }

        try {
            const data = await fetchDataFromTheServer();
            dispatch(setItems({
                data,
                deps: null,
            }));
        } catch (error) {
            dispatch(setError(STATUS_ERROR_READ));
        }
    };
};
```
