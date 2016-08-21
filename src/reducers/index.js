import { combineReducers } from 'redux';
import recording from './recording';
import beats from './beats';

const reducers = combineReducers({
    recording,
    beats
});

export default reducers;
