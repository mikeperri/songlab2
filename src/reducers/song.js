import _ from 'lodash';

const defaultSong = {
    key: 'C',
    measures: [],
    defaultNumberOfBeats: 4,
    selectedMeasureIndex: 0,
    selectedBeatIndex: null,
    editing: false
};

const songReducer = (state = defaultSong, action) => {
    if (action.type === 'ADD_CHORD') {
        let newSong = _.clone(state);

        if (state.selectedMeasureIndex === state.measures.length) {
            newSong.measures.push({
                numberOfBeats: state.defaultNumberOfBeats,
                chordTrack: {
                    beats: _.range(4).map((index) => {
                        let beat = {
                            tuplet: 4,
                            notes: []
                        };

                        if (index === 0) {
                            beat.notes.push({
                                division: 0,
                                chord: action.chord
                            });
                        }

                        return beat;
                    })
                },
                tracks: []
            });
        } else {
            // revise to allow chords on upbeats
            let selectedMeasure = state.measures[state.selectedMeasureIndex];
            let selectedBeat = selectedMeasure.chordTrack.beats[state.selectedBeatIndex || 0];

            if (selectedBeat.notes.length === 0) {
                selectedBeat.notes.push({ division: 0 });
            }

            let selectedNote = selectedBeat.notes[0];

            selectedNote.chord = action.chord;
        }

        return newSong;
    } else if (action.type === 'SELECTION_LEFT') {
        let newSong = _.clone(state);
        let selectedMeasure = newSong.measures[state.selectedMeasureIndex];

        function tryToDecrementMeasure() {
            if (state.selectedMeasureIndex > 0) {
                newSong.selectedMeasureIndex--;
                return true;
            } else {
                return false;
            }
        }

        if (state.selectedBeatIndex !== null) {
            if (state.selectedBeatIndex > 0) {
                newSong.selectedBeatIndex--;
            } else {
                let decremented = tryToDecrementMeasure();
                if (decremented) {
                    selectedMeasure = newSong.measures[newSong.selectedMeasureIndex];
                    newSong.selectedBeatIndex = selectedMeasure.numberOfBeats - 1;
                }
            }
        } else {
            tryToDecrementMeasure();
        }

        return newSong;
    } else if (action.type === 'SELECTION_RIGHT') {
        let newSong = _.clone(state);
        let selectedMeasure = newSong.measures[state.selectedMeasureIndex];

        function tryToIncrementMeasure() {
            if (state.selectedMeasureIndex < state.measures.length) {
                newSong.selectedMeasureIndex++;
                return true;
            } else {
                return false;
            }
        }

        if (state.selectedBeatIndex !== null && selectedMeasure) {
            if (state.selectedBeatIndex < selectedMeasure.numberOfBeats - 1) {
                newSong.selectedBeatIndex++;
            } else {
                let incremented = tryToIncrementMeasure();
                if (incremented) {
                    newSong.selectedBeatIndex = 0;
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
    } else if (action.type === 'DELETE_MEASURE') {
        let newSong = _.clone(state);

        newSong.measures = state.measures.filter((measure, index) => index !== action.measureIndex);

        if (action.measureIndex < state.selectedMeasureIndex) {
            newSong.selectedMeasureIndex--;
        } else if (state.selectedMeasureIndex > newSong.measures.length) {
            newSong.selectedMeasureIndex = newSong.measures.length - 1;
        }

        newSong.selectedBeatIndex = null;

        return newSong;
    } else if (action.type === 'DELETE_CHORD') {
        let newSong = _.clone(state);
        let measure = newSong.measures[state.selectedMeasureIndex];

        if (measure && state.selectedBeatIndex !== null) {
            let beat = measure.chordTrack.beats[state.selectedBeatIndex];

            beat.notes.shift();

            return newSong;
        } else {
            return state;
        }
    } else if (action.type === 'START_EDITING') {
        return Object.assign(state, { editing: true });
    } else if (action.type === 'STOP_EDITING') {
        return Object.assign(state, { editing: false });
    } else {
        return state;
    }
}

export default songReducer;
