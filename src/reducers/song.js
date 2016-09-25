import _ from 'lodash';
import undoable from '../utils/undoable.js';
import Song from '../constructors/song.js';
import Measure from '../constructors/measure.js';
import Track from '../constructors/track.js';
import Note from '../constructors/note.js';
import Division from '../constructors/division';
import { UNDOABLE_ACTION_TYPES } from '../utils/undoable.js';
import { INPUT_MODES } from '../constants.js';

import selectionLeft from './selectionLeft.js';
import selectionRight from './selectionRight.js';
import setSelectionResolution from './setSelectionResolution/';

const defaultSong = new Song({});

const songReducer = (state = defaultSong, action) => {
    function getTrackParams(id) {
        return Object.assign({}, state.defaultTrackParams, state.perTrackParams[id]);
    }

    function createDefaultMeasure() {
        return new Measure({
            numberOfBeats: state.defaultNumberOfBeats,
            defaultTuplet: state.defaultTuplet,
            trackIds: Object.keys(state.perTrackParams),
            getTrackParams
        });
    }

    function cloneOrCreateMeasure(measures, measureIndex) {
        if (measures[measureIndex]) {
            return _.cloneDeep(measures[measureIndex]);
        }

        let newMeasure = createDefaultMeasure();

        if (_.isUndefined(measureIndex)) {
            measures.push(newMeasure);
        } else {
            measures.splice(measureIndex, 0, newMeasure);
        }

        return newMeasure;
    }

    function createTrack(measure, trackIndex) {
        let newTrack = new Track({ numberOfBeats: measure.numberOfBeats });
        measure.tracks.push(newTrack);

        return newTrack;
    }

    if (action.type === 'SET_INPUT_MODE') {
        return Object.assign(_.clone(state), { inputMode: action.inputMode });
    } else if (action.type === 'SET_BEAT') {
        if (state.selectedTrackIndex === null) {
            return state;
        }

        let nextMeasures = _.clone(state.measures);
        let nextSelectedMeasure = cloneOrCreateMeasure(nextMeasures, state.selectedMeasureIndex);
        let selectedTrack = nextSelectedMeasure.tracks[state.selectedTrackIndex] || createTrack(nextSelectedMeasure);
        let selectedBeatIndex = state.selectedBeatIndex || 0;

        selectedTrack.tuplets[selectedBeatIndex] = action.tuplet;
        selectedTrack.beats.splice(selectedBeatIndex, 1, action.beat);

        nextMeasures[state.selectedMeasureIndex] = nextSelectedMeasure;

        let nextSelectedMeasureIndex, nextSelectedBeatIndex;

        if (selectedBeatIndex === nextSelectedMeasure.numberOfBeats - 1) {
            nextSelectedMeasureIndex = state.selectedMeasureIndex + 1;
            nextSelectedBeatIndex = 0;
        } else {
            nextSelectedMeasureIndex = state.selectedMeasureIndex;
            nextSelectedBeatIndex = selectedBeatIndex + 1;
        }

        return Object.assign(_.clone(state), {
            measures: nextMeasures,
            selectedMeasureIndex: nextSelectedMeasureIndex,
            selectedBeatIndex: nextSelectedBeatIndex
        });
    } else if (action.type === 'INSERT_MEASURE' && state.inputMode === INPUT_MODES.NORMAL) {
        let nextMeasures = _.clone(state.measures);
        let nextSelectedMeasure = cloneOrCreateMeasure(nextMeasures, state.selectedMeasureIndex);
        nextMeasures.splice(state.selectedMeasureIndex, 0, nextSelectedMeasure);

        return Object.assign(_.clone(state), {
            measures: nextMeasures
        });
    } else if (action.type === 'ADD_CHORD' && state.inputMode === INPUT_MODES.NORMAL) {
        let nextMeasures = _.clone(state.measures);
        let nextSelectedMeasure;

        if (state.selectedMeasureIndex >= state.measures.length) {
            nextSelectedMeasure = cloneOrCreateMeasure(nextMeasures, state.measures.length);
        } else {
            nextSelectedMeasure = _.cloneDeep(nextMeasures[state.selectedMeasureIndex]);
        }

        let chordTrack = nextSelectedMeasure.getChordTrack();

        if (chordTrack) {
            chordTrack.setChord({
                chord: action.chord,
                beatIndex: (state.selectedBeatIndex !== null) ? state.selectedBeatIndex : undefined,
                division: (state.selectedDivision !== null) ? state.selectedDivision : undefined
            });

            nextMeasures[state.selectedMeasureIndex] = nextSelectedMeasure;
        }

        return Object.assign(_.clone(state), { measures: nextMeasures });
    } else if (action.type === 'SET_PITCH' && state.inputMode === INPUT_MODES.PITCH) {
        let nextMeasures = _.clone(state.measures);
        let nextSelectedMeasure = nextMeasures[state.selectedMeasureIndex];

        if (nextSelectedMeasure) {
            let selectedNote = state.getNote({
                measureIndex: state.selectedMeasureIndex,
                trackIndex: state.selectedTrackIndex,
                beatIndex: state.selectedBeatIndex,
                division: state.selectedDivision
            });

            if (selectedNote) {
                selectedNote.pitch = action.pitch;
            }
        }

        return Object.assign(_.clone(state), { measures: nextMeasures });
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
        let nextMeasures = nextMeasures = state.measures.filter((measure, index) => index !== action.measureIndex);
        let nextSelectedBeatIndex = null;

        return Object.assign(_.clone(state), {
            measures: nextMeasures,
            selectedBeatIndex: nextSelectedBeatIndex
        });
    } else if (action.type === 'DELETE_NOTE' && state.inputMode === INPUT_MODES.NORMAL) {
        let selectedMeasure = state.measures[state.selectedMeasureIndex];

        if (selectedMeasure && state.selectedBeatIndex !== null) {
            let nextMeasures = _.clone(state.measures);
            let nextSelectedMeasure = _.clone(nextMeasures[state.selectedMeasureIndex]);
            let nextTracks = _.clone(nextSelectedMeasure.tracks);
            let nextSelectedTrack = _.cloneDeep(nextTracks[state.selectedTrackIndex]);

            nextSelectedTrack.deleteNote({
                beatIndex: state.selectedBeatIndex,
                division: state.selectedDivision
            });

            nextTracks[state.selectedTrackIndex] = nextSelectedTrack;
            nextSelectedMeasure.tracks = nextTracks;
            nextMeasures[state.selectedMeasureIndex] = nextSelectedMeasure;

            return Object.assign(_.clone(state), {
                measures: nextMeasures
            });
        } else {
            return state;
        }
    } else if (action.type === 'SET_SELECTION_RESOLUTION') {
        return setSelectionResolution(state, action);
    } else if (action.type === 'SET_SELECTION_TUPLET') {
        return Object.assign(_.clone(state), {
            selectionTuplet: action.tuplet
        });
    } else {
        return state;
    }
}

export default undoable(songReducer, {
    properties: [ 'key', 'measures', 'defaultNumberOfBeats' ]
});
