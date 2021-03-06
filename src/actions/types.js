const actionTypes = {
    SET_INPUT_MODE: 'SET_INPUT_MODE',
    SET_BEAT: 'SET_BEAT',
    SET_NOTE: 'SET_NOTE',
    INPUT_PITCH: 'INPUT_PITCH',
    ADD_TO_PITCH_OFFSET: 'ADD_TO_PITCH_OFFSET',
    SET_MODE: 'SET_MODE',
    INSERT_MEASURE: 'INSERT_MEASURE',
    SELECTION_LEFT: 'SELECTION_LEFT',
    SELECTION_RIGHT: 'SELECTION_RIGHT',
    SELECTION_UP: 'SELECTION_UP',
    SELECTION_DOWN: 'SELECTION_DOWN',
    SELECTION_TO_START: 'SELECTION_TO_START',
    DELETE_MEASURE: 'DELETE_MEASURE',
    DELETE_NOTE: 'DELETE_NOTE',
    START_EDITING: 'START_EDITING',
    STOP_EDITING: 'STOP_EDITING',
    SET_SELECTION_RESOLUTION: 'SET_SELECTION_RESOLUTION',
    SET_SELECTION_TUPLET: 'SET_SELECTION_TUPLET',
    SELECT_NEXT_NOTE: 'SELECT_NEXT_NOTE',
    SELECT_PREV_NOTE: 'SELECT_PREV_NOTE'
};

Object.freeze(actionTypes);

export default actionTypes;
