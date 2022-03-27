import { combineReducers } from 'redux';
import { RootState } from '../store';
import Action from 'common-ui/src/types/action';
import { reducer as form } from 'redux-form';
import login from './login';
import status from './status';
import probe from './probe';
import subscribe from './subscribe';

const appReducer = combineReducers({ form, login, status, probe, subscribe });

export default (state: RootState, action: Action) => {
    if (action.type === 'CLEAR_STORE') {
        state = undefined;
    }

    return appReducer(state, action);
};
