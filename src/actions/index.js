import types from './types';

export const setRecording = (recording) => {
    return {
        type: types.SET_RECORDING,
        recording
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
