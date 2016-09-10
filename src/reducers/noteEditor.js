import { combineReducers } from 'redux';
import undoable, { distinctState } from 'redux-undo';
import { MODES } from '../containers/Editor/constants';

const recordingReducer = (state = false, action) => {
    switch (action.type) {
        case 'SET_RECORDING':
            return action.recording;
        default:
            return state;
    }
};

const beatsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_BEATS':
            return action.beats;
        case 'APPEND_BEATS':
            return state.concat(action.beats);
        default:
            return state;
    }
};

const undoableBeatsReducer = undoable(beatsReducer, {
    filter: distinctState()
});

const offsetReducer = (state = 0, action) => {
    switch (action.type) {
        case 'ADD_TO_PITCH_OFFSET':
            return state + action.delta;
        default:
            return state;
    }
};

const modeReducer = (state = MODES.RHYTHM, action) => {
    switch (action.type) {
        case 'SET_MODE':
            return action.mode;
        default:
            return state;
    }
};

const reducers = combineReducers({
    recording: recordingReducer,
    beats: undoableBeatsReducer,
    pitch: combineReducers({
        offset: offsetReducer
    }),
    mode: modeReducer
});

export default reducers;
