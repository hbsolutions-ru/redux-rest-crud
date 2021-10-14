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
    selectors: { getAll, getById, getStatus },

    // extract the thunks you need
    thunks: { loadItems }
} = createSlice('myEntities', {
    // pass async function to retrieve data
    fetchFunc: fetchDataFromTheServer,

    // pass auth checking callback if needed
    checkAuthFunc: state => state.isAuth,
});

// extract the necessary actions for use in thunks or elsewhere
export const { startLoading, setItems, setError, addItem, editItem, deleteItem } = myEntitySlice.actions;

// export reducer to configure the store
export default myEntitySlice.reducer;
```

Component example:
```jsx harmony
import React from 'react';
import { useSelector } from 'react-redux';
import { withLoader } from '@hbsolutions/redux-rest-crud';

import { myEntitySlice, getAll, loadItems } from './myEntitySlice';

const MyEntitiesList = () => {
    const myEntities = useSelector(getAll);

    return (
        <ul>
            {myEntities.map((entity, index) => (
                <li key={index}>{entity.name}</li>
            ))}
        </ul>
    );
};

export default withLoader(
    MyEntitiesList,
    myEntitySlice.name,
    loadItems
);
```
