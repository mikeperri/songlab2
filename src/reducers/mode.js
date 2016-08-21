import { MODES } from '../containers/Editor/constants';

let defaultMode = MODES.RHYTHM;

const modeReducer = (state = defaultMode, action) => {
    switch (action.type) {
        case 'SET_MODE':
            return action.mode;
        default:
            return state;
    }
};

export default modeReducer;
