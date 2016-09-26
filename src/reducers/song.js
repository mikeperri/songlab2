import _ from 'lodash';
import undoable from '../utils/undoable.js';
import Song from '../constructors/song.js';
import Measure from '../constructors/measure.js';
import Track from '../constructors/track.js';
import Note from '../constructors/note.js';
import Division from '../constructors/division';
import { UNDOABLE_ACTION_TYPES } from '../utils/undoable.js';
import { INPUT_MODES } from '../constants.js';
import clonePath from '../utils/clonePath';

import setNote from './setNote.js';
import selectionLeft from './selectionLeft.js';
import selectionRight from './selectionRight.js';
import setSelectionResolution from './setSelectionResolution/';

const defaultSong = new Song({});

const songReducer = (state = defaultSong, action) => {

    if (action.type === 'SET_INPUT_MODE') {
        return Object.assign(_.clone(state), { inputMode: action.inputMode });
    } else if (action.type === 'SET_BEAT') {
        if (state.selectedTrackIndex === null) {
            return state;
        }

        let selectedTrackIndex = state.selectedTrackIndex || 0;
        let selectedBeatIndex = state.selectedBeatIndex || 0;

        let nextState = clonePath({
            state,
            measureIndex: state.selectedMeasureIndex,
            trackIndex: selectedTrackIndex,
            beatIndex: selectedBeatIndex,
            division: state.selectedDivision
        });

        let measure = nextState.getMeasure({
            measureIndex: state.selectedMeasureIndex
        });

        let track = nextState.getTrack({
            measureIndex: state.selectedMeasureIndex,
            trackIndex: selectedTrackIndex,
            beatIndex: selectedBeatIndex
        });
        track.beats.splice(selectedBeatIndex, 1, action.beat);

        // Factor out this logic from selectionRight
        if (selectedBeatIndex === measure.numberOfBeats - 1) {
            nextState.selectedMeasureIndex = state.selectedMeasureIndex + 1;
            nextState.selectedBeatIndex = 0;
        } else {
            nextState.selectedMeasureIndex = state.selectedMeasureIndex;
            nextState.selectedBeatIndex = selectedBeatIndex + 1;
        }

        return nextState;
    } else if (action.type === 'INSERT_MEASURE' && state.inputMode === INPUT_MODES.NORMAL) {
        let nextState = clonePath({
            state,
            measureIndex: state.selectedMeasureIndex
        });

        if (state.measures.length === nextState.measures.length) {
            nextState.measures.splice(state.selectedMeasureIndex, 0, state.createDefaultMeasure());
        }

        return nextState;
    } else if (action.type === 'SET_NOTE') {
        return setNote(state, action);
    } else if (action.type === 'SELECTION_LEFT' && state.inputMode === INPUT_MODES.NORMAL) {
        return selectionLeft(state);
    } else if (action.type === 'SELECTION_RIGHT' && state.inputMode === INPUT_MODES.NORMAL) {
        return selectionRight(state);
    } else if (action.type === 'SELECTION_UP' && state.inputMode === INPUT_MODES.NORMAL) {
        let nextSong = _.clone(state);

        if (state.selectedTrackIndex === 0) {
            nextSong.selectedTrackIndex = null;
            nextSong.selectedBeatIndex = null;
            nextSong.selectedDivisionIndex = null;
        } else if (state.selectedTrackIndex !== null) {
            nextSong.selectedTrackIndex = state.selectedTrackIndex - 1;
        }

        return nextSong;
    } else if (action.type === 'SELECTION_DOWN' && state.inputMode === INPUT_MODES.NORMAL) {
        let nextSong = _.clone(state);

        if (state.selectedTrackIndex === null) {
            nextSong.selectedTrackIndex = 0;
            nextSong.selectedBeatIndex = 0;
            nextSong.selectedDivisionIndex = 0;
        } else if (state.selectedTrackIndex < Object.keys(state.perTrackParams).length - 1) {
            nextSong.selectedTrackIndex = state.selectedTrackIndex + 1;
        }

        return nextSong;
    } else if (action.type === 'DELETE_MEASURE' && state.inputMode === INPUT_MODES.NORMAL) {
        let filterFn = (measure, index) => index !== action.measureIndex;
        let nextMeasures = nextMeasures = state.measures.filter(filterFn);
        let nextSelectedBeatIndex = null;

        return Object.assign(_.clone(state), {
            measures: nextMeasures,
            selectedBeatIndex: nextSelectedBeatIndex
        });
    } else if (action.type === 'DELETE_NOTE' && state.inputMode === INPUT_MODES.NORMAL) {
        if (state.selectedTrackIndex !== null) {
            let note = state.getSelectedNote();

            let nextState = clonePath({
                state,
                measureIndex: state.selectedMeasureIndex,
                trackIndex: state.selectedTrackIndex,
                beatIndex: state.selectedBeatIndex,
                division: state.selectedDivision
            });

            nextState.deleteNote({
                measureIndex: state.selectedMeasureIndex,
                trackIndex: state.selectedTrackIndex,
                beatIndex: state.selectedBeatIndex,
                division: state.selectedDivision
            });

            return nextState;
        } else {
            return state;
        }
    } else if (action.type === 'SET_SELECTION_RESOLUTION') {
        return setSelectionResolution(state, action);
    } else if (action.type === 'SET_SELECTION_TUPLET') {
        let nextState = setSelectionResolution(state, { resolution: 0 });

        return Object.assign(nextState, {
            selectionTuplet: action.tuplet,
            selectedDivision: new Division(0, 1)
        });
    } else if (action.type === 'SELECT_NEXT_NOTE') {
        let measure = state.getSelectedMeasure();
        console.log(measure);

        return state;
    } else if (action.type === 'SELECT_PREV_NOTE') {
        return state;
    } else {
        return state;
    }
}

export default undoable(songReducer, {
    properties: [ 'key', 'measures', 'defaultNumberOfBeats' ]
});
