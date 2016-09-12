import _ from 'lodash';
import undoable from '../utils/undoable.js';
import Measure from '../constructors/measure.js';
import Track from '../constructors/track.js';
import { UNDOABLE_ACTION_TYPES } from '../utils/undoable.js';
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
    function cloneOrCreateMeasure(measures, measureIndex) {
        if (measures[measureIndex]) {
            return _.cloneDeep(measures[measureIndex]);
        }

        let newMeasure = new Measure({ numberOfBeats: state.defaultNumberOfBeats });

        if (_.isUndefined(measureIndex)) {
            measures.push(newMeasure);
        } else {
            measures.splice(measureIndex, 0, newMeasure);
        }

        return newMeasure;
    }

    function createTrack(measure, trackIndex) {
        let newTrack = new Track({});
        measure.tracks[state.selectedTrackIndex] = newTrack;

        return newTrack;
    }

    if (action.type === 'SET_INPUT_MODE') {
        return Object.assign({}, state, { inputMode: action.inputMode });
    } else if (action.type === 'SET_BEATS') {
        let nextMeasures = _.clone(state.measures);
        let nextSelectedMeasure = cloneOrCreateMeasure(nextMeasures, state.selectedMeasureIndex);
        let selectedTrack = nextSelectedMeasure.tracks[state.selectedTrackIndex] || createTrack(nextSelectedMeasure);
        let selectedBeatIndex = state.selectedBeatIndex || 0;

        selectedTrack.beats.splice(selectedBeatIndex, action.beats.length, ...action.beats);

        nextMeasures[state.selectedMeasureIndex] = nextSelectedMeasure;

        let nextSelectedMeasureIndex, nextSelectedBeatIndex;

        if (selectedBeatIndex === nextSelectedMeasure.numberOfBeats - 1) {
            nextSelectedMeasureIndex = state.selectedMeasureIndex + 1;
            nextSelectedBeatIndex = 0;
        } else {
            nextSelectedMeasureIndex = state.selectedMeasureIndex;
            nextSelectedBeatIndex = selectedBeatIndex + 1;
        }

        return Object.assign({}, state, {
            measures: nextMeasures,
            selectedMeasureIndex: nextSelectedMeasureIndex,
            selectedBeatIndex: nextSelectedBeatIndex
        });
    } else if (action.type === 'INSERT_MEASURE' && state.inputMode === INPUT_MODES.NORMAL) {
        let newSong = _.clone(state);

        createMeasure(newSong, action.measureIndex);

        return newSong;
    } else if (action.type === 'ADD_CHORD' && state.inputMode === INPUT_MODES.NORMAL) {
        let nextMeasures = _.clone(state.measures);

        if (state.selectedMeasureIndex >= state.measures.length) {
            nextMeasures.push(new Measure({
                numberOfBeats: state.defaultNumberOfBeats,
                chord: action.chord
            }));
        } else {
            // revise to allow chords on upbeats
            let nextSelectedMeasure = _.cloneDeep(nextMeasures[state.selectedMeasureIndex]);
            let selectedBeat = nextSelectedMeasure.chordTrack.beats[state.selectedBeatIndex || 0];

            if (selectedBeat.notes.length === 0) {
                selectedBeat.notes.push({ division: 0 });
            }

            selectedBeat.notes[0].chord = action.chord;

            nextMeasures[state.selectedMeasureIndex] = nextSelectedMeasure;
        }

        return Object.assign({}, state, { measures: nextMeasures });
    } else if (action.type === 'SELECTION_LEFT' && state.inputMode === INPUT_MODES.NORMAL) {
        let newSong = _.clone(state);
        let selectedMeasure = newSong.measures[state.selectedMeasureIndex];

        function tryToDecrementMeasure() {
            if (state.selectedMeasureIndex >= state.measures.length) {
                newSong.selectedMeasureIndex = state.measures.length - 1;
            } else if (state.selectedMeasureIndex > 0) {
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
        let nextMeasures = nextMeasures = state.measures.filter((measure, index) => index !== action.measureIndex);
        let nextSelectedBeatIndex = null;

        return Object.assign({}, state, {
            measures: nextMeasures,
            selectedBeatIndex: nextSelectedBeatIndex
        });
    } else if (action.type === 'DELETE_CHORD' && state.inputMode === INPUT_MODES.NORMAL) {
        let selectedMeasure = state.measures[state.selectedMeasureIndex];

        if (selectedMeasure && state.selectedBeatIndex !== null) {
            let nextMeasures = _.clone(state.measures);
            let nextSelectedMeasure = _.cloneDeep(selectedMeasure);
            let beat = nextSelectedMeasure.chordTrack.beats[state.selectedBeatIndex];

            beat.notes.shift();
            nextMeasures[state.selectedMeasureIndex] = nextSelectedMeasure;

            return Object.assign({}, state, {
                measures: nextMeasures
            });
        } else {
            return state;
        }
    } else {
        return state;
    }
}

export default undoable(songReducer, {
    properties: [ 'key', 'measures', 'defaultNumberOfBeats' ]
});
