import * as C from './constants';

export const getStatus = name => state => ({
    hasError: C.ERRORS_STATUSES.indexOf(state[name].status) !== -1,
    isLoading: state[name].status === C.STATUS_LOADING,
    isReady: state[name].status === C.STATUS_OK,
});
