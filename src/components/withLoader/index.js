import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStatus } from '../../utils';

const withLoader = (
    Component,
    sliceName,
    loadItems,
    renderError = () => 'Error!',
    renderLoading = () => 'Loading...',
) => props => {
    const dispatch = useDispatch();

    const status = useSelector(getStatus(sliceName));

    useEffect(() => {
        if (!(
            status.isReady || status.isLoading || status.hasError
        )) {
            dispatch(loadItems());
        }
    }, [dispatch, status]);

    if (status.hasError) {
        return renderError();
    }

    if (status.isLoading) {
        return renderLoading();
    }

    return (
        <Component {...props } />
    );
};

export default withLoader;
