import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as C from '../../constants';

const getStatuses = keys => state => keys.reduce((acc, key) => {
    acc[key] = {
        hasError: C.ERRORS_STATUSES.indexOf(state[key].status) !== -1,
        isLoading: state[key].status === C.STATUS_LOADING,
        isReady: state[key].status === C.STATUS_OK,
    };
    return acc;
}, {});

const withLoader = (
    Component,
    loaders = {},
    renderError = () => 'Error!',
    renderLoading = () => 'Loading...',
) => props => {
    const dispatch = useDispatch();
    const keys = Object.keys(loaders);
    const statuses = useSelector(getStatuses(keys));

    useEffect(() => {
        for (const key of keys) {
            if (!(
                statuses[key].isReady || statuses[key].isLoading || statuses[key].hasError
            )) {
                dispatch(loaders[key]());
            }
        }
    }, [dispatch, statuses]);

    if (keys.some(key => statuses[key].hasError)) {
        return renderError();
    }

    if (keys.some(key => statuses[key].isLoading)) {
        return renderLoading();
    }

    return (
        <Component {...props } />
    );
};

export default withLoader;
