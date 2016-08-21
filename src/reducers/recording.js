const recordingReducer = (state = false, action) => {
    switch (action.type) {
        case 'SET_RECORDING':
            return action.recording;
        default:
            return state;
    }
};

export default recordingReducer;
