import types from './types';

export const setInputMode = (inputMode) => {
    return {
        type: types.SET_INPUT_MODE,
        inputMode
    };
};

export const setBeats = (beats) => {
    return {
        type: types.SET_BEATS,
        beats
    };
};

export const appendBeats = (beats) => {
    return {
        type: types.APPEND_BEATS,
        beats
    };
};

export const addToPitchOffset = (delta) => {
    return {
        type: types.ADD_TO_PITCH_OFFSET,
        delta
    };
};

export const setMode = (mode) => {
    return {
        type: types.SET_MODE,
        mode
    };
};

export const insertMeasure = (measureIndex) => {
    return {
        type: types.INSERT_MEASURE,
        measureIndex
    }
};

export const addChord = (chord) => {
    return {
        type: types.ADD_CHORD,
        chord
    };
};

export const selectionLeft = () => {
    return {
        type: types.SELECTION_LEFT
    };
};

export const selectionRight = () => {
    return {
        type: types.SELECTION_RIGHT
    };
};

export const selectionUp = () => {
    return {
        type: types.SELECTION_UP
    };
};

export const selectionDown = () => {
    return {
        type: types.SELECTION_DOWN
    };
};

export const deleteMeasure = (measureIndex) => {
    return {
        type: types.DELETE_MEASURE,
        measureIndex
    };
};

export const deleteChord = (measureIndex, beatIndex) => {
    return {
        type: types.DELETE_CHORD,
        measureIndex,
        beatIndex
    };
};

export const startEditing = () => {
    return {
        type: types.START_EDITING
    };
};

export const stopEditing = () => {
    return {
        type: types.STOP_EDITING
    };
};
