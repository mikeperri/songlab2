import _ from 'lodash';

const defaultSong = {
    key: 'C',
    measures: [],
    selectedMeasureIndex: 0,
    selectedBeatIndex: null
};

const songReducer = (state = defaultSong, action) => {
    if (action.type === 'ADD_CHORD') {
        let newSong = _.clone(state);

        newSong.measures.push({
            chord: action.chord,
            numberOfBeats: 4,
            tracks: []
        });

        return newSong;
    } else if (action.type === 'SELECTION_LEFT') {
        let newSong = _.clone(state);

        function tryToDecrementMeasure() {
            if (state.selectedMeasureIndex > 0) {
                newSong.selectedMeasureIndex--;
                return true;
            } else {
                return false;
            }
        }

        if (state.selectedBeatIndex !== null) {
            let selectedMeasure = newSong.measures[state.selectedMeasureIndex];

            if (selectedMeasure) {
                if (state.selectedBeatIndex > 0) {
                    newSong.selectedBeatIndex--;
                } else {
                    let decremented = tryToDecrementMeasure();
                    if (decremented) {
                        selectedMeasure = newSong.measures[newSong.selectedMeasureIndex];
                        newSong.selectedBeatIndex = selectedMeasure.numberOfBeats - 1;
                    }
                }
            }
        } else {
            tryToDecrementMeasure();
        }

        return newSong;
    } else if (action.type === 'SELECTION_RIGHT') {
        let newSong = _.clone(state);

        function tryToIncrementMeasure() {
            if (state.selectedMeasureIndex < state.measures.length - 1) {
                newSong.selectedMeasureIndex++;
                return true;
            } else {
                return false;
            }
        }

        if (state.selectedBeatIndex !== null) {
            let selectedMeasure = newSong.measures[state.selectedMeasureIndex];

            if (selectedMeasure) {
                if (state.selectedBeatIndex < selectedMeasure.numberOfBeats - 1) {
                    newSong.selectedBeatIndex++;
                } else {
                    let incremented = tryToIncrementMeasure();
                    if (incremented) {
                        newSong.selectedBeatIndex = 0;
                    }
                }
            }
        } else {
            tryToIncrementMeasure();
        }

        return newSong;
    } else if (action.type === 'SELECTION_UP') {
        if (state.selectedBeatIndex !== null) {
            let newSong = _.clone(state);

            newSong.selectedBeatIndex = null;

            return newSong;
        } else {
            return state;
        }
    } else if (action.type === 'SELECTION_DOWN') {
        if (state.selectedBeatIndex === null) {
            let newSong = _.clone(state);

            newSong.selectedBeatIndex = 0;

            return newSong;
        } else {
            return state;
        }
    } else {
        return state;
    }
}

export default songReducer;
