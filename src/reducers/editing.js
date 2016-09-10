const editingReducer = (state = false, action) => {
    if (action.type === 'START_EDITING') {
        return true;
    } else if (action.type === 'STOP_EDITING') {
        return false;
    } else {
        return state;
    }
};

export default editingReducer;
