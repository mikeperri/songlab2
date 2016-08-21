import { combineReducers } from 'redux';
import recording from './recording';
import beats from './beats';
import pitch from './pitch';
import mode from './mode';

const reducers = combineReducers({
    recording,
    beats,
    pitch,
    mode
});

export default reducers;
