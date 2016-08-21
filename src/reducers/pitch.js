import { combineReducers } from 'redux';

const offsetReducer = (state = 0, action) => {
    switch (action.type) {
        case 'ADD_TO_PITCH_OFFSET':
            return state + action.delta;
        default:
            return state;
    }
};

const pitchReducers = combineReducers({
    offset: offsetReducer
});

export default pitchReducers;
