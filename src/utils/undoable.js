const ACTION_TYPES = {
    UNDO: 'UNDO',
    REDO: 'REDO'
};

export { ACTION_TYPES };

export default function undoable(reducer, config) {
    const initialState = {
        past: [],
        present: reducer(undefined, {}),
        future: []
    };

    function getNextState(prevState, state) {
        if (config.properties) {
            return Object.assign({}, prevState, _.pick(state, config.properties));
        } else {
            return state;
        }
    }

    function didPropertyChange(prevState, state) {
        if (config.properties) {
            return _.reduce(config.properties, (acc, value) => {
                return acc || prevState[value] !== state[value];
            }, false);
        } else {
            return true;
        }
    }

    return function (state = initialState, action) {
        const { past, present, future } = state;

        if (action.type === ACTION_TYPES.UNDO) {
            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);
            const newPresent = getNextState(present, previous);
            return {
                past: newPast,
                present: newPresent,
                future: [ present, ...future ]
            };
        } else if (action.type === ACTION_TYPES.REDO) {
            const next = future[0];
            const newFuture = future.slice(1);
            return {
                past: [ ...past, present ],
                present: getNextState(present, next),
                future: newFuture
            };
        } else {
            const newPresent = reducer(present, action);

            if (present === newPresent) {
                return state;
            }

            if (!didPropertyChange(present, newPresent)) {
                return Object.assign({}, state, {
                    present: newPresent
                });
            }

            return {
                past: [ ...past, present ],
                present: newPresent,
                future: []
            };
        }
    };
}
