import { combineReducers } from 'redux';
import editing from './editing.js';
import recording from './recording.js';
import beats from './beats.js';
import pitch from './pitch.js';
import mode from './mode.js';
import song from './song.js';

const reducers = combineReducers({
    editing,
    recording,
    beats,
    pitch,
    mode,
    song
});

export default reducers;
