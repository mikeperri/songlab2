import _ from 'lodash';
import undoable from '../utils/undoable.js';
import Song from '../constructors/song.js';
import Measure from '../constructors/measure.js';
import Track from '../constructors/track.js';
import Note from '../constructors/note.js';
import Division from '../constructors/division';
import { UNDOABLE_ACTION_TYPES } from '../utils/undoable.js';
import { INPUT_MODES, MAX_RESOLUTION } from '../constants.js';
import clonePath from '../utils/clonePath';

import setNote from './setNote.js';
import selectionLeft from './selectionLeft.js';
import selectionRight from './selectionRight.js';
import setSelectionResolution from './setSelectionResolution/';

const defaultSong = new Song({});

const songReducer = (state = defaultSong, action) => {

    function getNextSelectionResolutionAndTuplet({ selectedDivision, selectionResolution, tuplets }) {
        let tupletIndex = 0;
        let tuplet;

        while (tupletIndex < tuplets.length) {
            tuplet = tuplets[tupletIndex];

            while (selectionResolution <= MAX_RESOLUTION) {
                if (tuplet * Math.pow(2, selectionResolution) % selectedDivision[1] === 0) {
                    return {
                        nextSelectionResolution: selectionResolution,
                        nextSelectionTuplet: tuplet
                    };
                }
                selectionResolution++;
            }

            tupletIndex++;
            selectionResolution = 0;
        }

        throw new Error('Not supposed to happen.');
    }

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
            nextSong.selectedDivision = new Division(0, 1);
        } else if (state.selectedTrackIndex !== null) {
            nextSong.selectedTrackIndex = state.selectedTrackIndex - 1;
        }

        return nextSong;
    } else if (action.type === 'SELECTION_DOWN' && state.inputMode === INPUT_MODES.NORMAL) {
        let nextSong = _.clone(state);

        if (state.selectedTrackIndex === null) {
            nextSong.selectedTrackIndex = 0;
            nextSong.selectedBeatIndex = 0;
        } else if (state.selectedTrackIndex < Object.keys(state.perTrackParams).length - 1) {
            nextSong.selectedTrackIndex = state.selectedTrackIndex + 1;
        }

        return nextSong;
    } else if (action.type === 'SELECTION_TO_START' && state.inputMode === INPUT_MODES.NORMAL) {
        let nextSong = _.clone(state);

        if (nextSong.getSelectedBeat()) {
            nextSong.selectedBeatIndex = 0;
            nextSong.selectedDivision = new Division(0, 1);
        }
        nextSong.selectedMeasureIndex = 0;

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
        if (!state.getSelectedBeat()) {
            return state;
        }

        let nextState = _.clone(state);
        let notes = state.getSelectedBeat().getNotesAfterDivision(state.selectedDivision);

        while (notes && notes.length === 0) {
            if (nextState.selectedBeatIndex < nextState.getSelectedMeasure().numberOfBeats - 1) {
                nextState.selectedBeatIndex++;
            } else {
                nextState.selectedMeasureIndex++;
                nextState.selectedBeatIndex = 0;
            }
            nextState.selectedDivision = new Division(0, 1);
            notes = nextState.getSelectedMeasure() && nextState.getSelectedBeat().notes;
        }

        if (notes && notes.length > 0) {
            nextState.selectedDivision = notes[0].division;
            let filterFn = (t) => t !== state.selectionTuplet;
            let tuplets = [ state.selectionTuplet ].concat(state.tuplets.filter(filterFn));

            let { nextSelectionResolution, nextSelectionTuplet } = getNextSelectionResolutionAndTuplet({
                selectedDivision: nextState.selectedDivision,
                selectionResolution: state.selectionResolution,
                tuplets
            });
            nextState.selectionResolution = nextSelectionResolution;
            nextState.selectionTuplet = nextSelectionTuplet;
        }

        return nextState;
    } else if (action.type === 'SELECT_PREV_NOTE') {
        if (state.selectedTrackIndex === null) {
            return state;
        }

        let nextState;

        if (!state.getSelectedMeasure()) {
            nextState = selectionLeft(state);
        } else {
            nextState = _.clone(state);
        }

        let notes = nextState.getSelectedBeat().getNotesBeforeDivision(nextState.selectedDivision);

        while (notes.length === 0) {
            if (nextState.selectedBeatIndex > 0) {
                nextState.selectedBeatIndex--;
            } else if (nextState.selectedMeasureIndex > 0) {
                nextState.selectedMeasureIndex--;
                nextState.selectedBeatIndex = nextState.getSelectedMeasure().numberOfBeats - 1;
            } else {
                break;
            }
            nextState.selectedDivision = new Division(0, 1);
            notes = nextState.getSelectedBeat().notes;
        }

        if (notes.length > 0) {
            nextState.selectedDivision = _.last(notes).division;
            let filterFn = (t) => t !== state.selectionTuplet;
            let tuplets = [ state.selectionTuplet ].concat(state.tuplets.filter(filterFn));

            let { nextSelectionResolution, nextSelectionTuplet } = getNextSelectionResolutionAndTuplet({
                selectedDivision: nextState.selectedDivision,
                selectionResolution: state.selectionResolution,
                tuplets
            });
            nextState.selectionResolution = nextSelectionResolution;
            nextState.selectionTuplet = nextSelectionTuplet;
        }

        return nextState;
    } else {
        return state;
    }
}

export default undoable(songReducer, {
    properties: [ 'key', 'measures', 'defaultNumberOfBeats' ]
});
