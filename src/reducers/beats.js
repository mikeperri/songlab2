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

export default beatsReducer;
