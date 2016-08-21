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
    }
};
