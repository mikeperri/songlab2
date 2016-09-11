import _ from 'lodash';
import Measure from '../constructors/measure.js';
import Track from '../constructors/track.js';
import { INPUT_MODES } from '../constants.js';

const defaultSong = {
    key: 'C',
    measures: [],
    defaultNumberOfBeats: 4,
    selectedMeasureIndex: 0,
    selectedTrackIndex: 0,
    selectedBeatIndex: null,
    inputMode: INPUT_MODES.NORMAL
};

const songReducer = (state = defaultSong, action) => {
    function createTrack(measure) {
        let newTrack = new Track({});
        measure.tracks[state.selectedTrackIndex] = newTrack;

        return newTrack;
    }

    function createMeasure(song, measureIndex) {
        let newMeasure = new Measure({ numberOfBeats: state.defaultNumberOfBeats });

        if (_.isUndefined(measureIndex)) {
            song.measures.push(newMeasure);
        } else {
            song.measures.splice(measureIndex, 0, newMeasure);
        }

        return newMeasure;
    }

    if (action.type === 'SET_INPUT_MODE') {
        return Object.assign({}, state, { inputMode: action.inputMode });
    } else if (action.type === 'SET_BEATS') {
        let newSong = _.clone(state);
        let selectedMeasure = newSong.measures[state.selectedMeasureIndex] || createMeasure(newSong);
        let selectedTrack = selectedMeasure.tracks[state.selectedTrackIndex] || createTrack(selectedMeasure);

        selectedTrack.beats = action.beats;

        return newSong;
    } else if (action.type === 'APPEND_BEATS') {
        let newSong = _.clone(state);
        let selectedMeasure, selectedTrack;

        selectedMeasure = newSong.measures[newSong.selectedMeasureIndex] || createMeasure(newSong);
        selectedTrack = selectedMeasure.tracks[state.selectedTrackIndex] || createTrack(selectedMeasure);

        while (selectedTrack.beats.length === selectedMeasure.numberOfBeats) {
            newSong.selectedMeasureIndex++;
            selectedMeasure = newSong.measures[newSong.selectedMeasureIndex] || createMeasure(newSong);
            selectedTrack = selectedMeasure.tracks[state.selectedTrackIndex] || createTrack(selectedMeasure);
            selectedTrack.beats = [];
        }

        selectedTrack.beats = selectedTrack.beats.concat(action.beats);

        return newSong;
    } else if (action.type === 'INSERT_MEASURE' && state.inputMode === INPUT_MODES.NORMAL) {
        let newSong = _.clone(state);

        createMeasure(newSong, action.measureIndex);

        return newSong;
    } else if (action.type === 'ADD_CHORD' && state.inputMode === INPUT_MODES.NORMAL) {
        let newSong = _.clone(state);

        if (state.selectedMeasureIndex === state.measures.length) {
            newSong.measures.push(new Measure({
                numberOfBeats: state.defaultNumberOfBeats,
                chord: action.chord
            }));
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
    } else if (action.type === 'SELECTION_LEFT' && state.inputMode === INPUT_MODES.NORMAL) {
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
    } else if (action.type === 'SELECTION_RIGHT' && state.inputMode === INPUT_MODES.NORMAL) {
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
    } else if (action.type === 'SELECTION_UP' && state.inputMode === INPUT_MODES.NORMAL) {
        if (state.selectedBeatIndex !== null) {
            let newSong = _.clone(state);

            newSong.selectedBeatIndex = null;

            return newSong;
        } else {
            return state;
        }
    } else if (action.type === 'SELECTION_DOWN' && state.inputMode === INPUT_MODES.NORMAL) {
        if (state.selectedBeatIndex === null) {
            let newSong = _.clone(state);

            newSong.selectedBeatIndex = 0;

            return newSong;
        } else {
            return state;
        }
    } else if (action.type === 'DELETE_MEASURE' && state.inputMode === INPUT_MODES.NORMAL) {
        let newSong = _.clone(state);

        newSong.measures = state.measures.filter((measure, index) => index !== action.measureIndex);

        if (action.measureIndex < state.selectedMeasureIndex) {
            newSong.selectedMeasureIndex--;
        } else if (state.selectedMeasureIndex > newSong.measures.length) {
            newSong.selectedMeasureIndex = newSong.measures.length - 1;
        }

        newSong.selectedBeatIndex = null;

        return newSong;
    } else if (action.type === 'DELETE_CHORD' && state.inputMode === INPUT_MODES.NORMAL) {
        let newSong = _.clone(state);
        let measure = newSong.measures[state.selectedMeasureIndex];

        if (measure && state.selectedBeatIndex !== null) {
            let beat = measure.chordTrack.beats[state.selectedBeatIndex];

            beat.notes.shift();

            return newSong;
        } else {
            return state;
        }
    } else {
        return state;
    }
}

export default songReducer;
