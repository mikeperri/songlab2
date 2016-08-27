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