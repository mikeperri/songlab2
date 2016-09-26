import Measure from '../constructors/measure';
import Note from '../constructors/note';
import Division from '../constructors/division';
import { INPUT_MODES } from '../constants.js';

export default class Song {
    constructor({
        key = 'C',
        measures = [],
        defaultNumberOfBeats = 4,
        defaultTuplet = 1,
        tuplets = [1, 3],
        defaultTrackOptions = {},
        perTrackParams = {
            0: { name: 'Chord Track', type: 'chord', index: 0 },
            1: { name: 'Note Track 1', type: 'note', index: 1 },
            2: { name: 'Note Track 2', type: 'note', index: 2 }
        },
        selectedMeasureIndex = 0,
        selectedTrackIndex = null,
        selectedNoteIndex = 0,
        selectedBeatIndex = null,
        selectedDivision = new Division(0, 1),
        selectionResolution = 0,
        selectionTuplet = 1,
        inputMode = INPUT_MODES.NORMAL
    }) {
        this.key = key;
        this.measures = measures;
        this.defaultNumberOfBeats = defaultNumberOfBeats;
        this.defaultTuplet = defaultTuplet;
        this.tuplets = tuplets;
        this.defaultTrackOptions = defaultTrackOptions;
        this.perTrackParams = perTrackParams;
        this.selectedMeasureIndex = selectedMeasureIndex;
        this.selectedTrackIndex = selectedTrackIndex;
        this.selectedNoteIndex = selectedNoteIndex;
        this.selectedBeatIndex = selectedBeatIndex;
        this.selectedDivision = selectedDivision;
        this.selectionResolution = selectionResolution;
        this.selectionTuplet = selectionTuplet;
        this.inputMode = inputMode;
    }
    createDefaultMeasure() {
        let getTrackParams = (id) => {
            return Object.assign({}, this.defaultTrackParams, this.perTrackParams[id]);
        }

        return new Measure({
            numberOfBeats: this.defaultNumberOfBeats,
            defaultTuplet: this.defaultTuplet,
            trackIds: Object.keys(this.perTrackParams),
            getTrackParams
        });

        // TODO: Change trackIds to getTrackIds
    }
    createDefaultNote() {
        return new Note({ division: _.clone(this.selectedDivision) });
    }
    getMeasure({ measureIndex }) {
        let measure = this.measures[measureIndex];

        return measure;
    }
    getSelectedMeasure() {
        return this.getMeasure({
            measureIndex: this.selectedMeasureIndex
        });
    }
    getTrack({ measureIndex, trackIndex }) {
        let measure = this.getMeasure({ measureIndex });

        if (measure) {
            return measure.tracks[trackIndex];
        }
    }
    getSelectedTrack() {
        return this.getTrack({
            measureIndex: this.selectedMeasureIndex,
            trackIndex: this.selectedTrackIndex
        });
    }
    getBeat({ measureIndex, trackIndex, beatIndex }) {
        let track = this.getTrack({ measureIndex, trackIndex });

        if (track) {
            return track.beats[beatIndex];
        }
    }
    getSelectedBeat() {
        return this.getBeat({
            measureIndex: this.selectedMeasureIndex,
            trackIndex: this.selectedTrackIndex,
            beatIndex: this.selectedBeatIndex
        });
    }
    getNote({ measureIndex, trackIndex, beatIndex, division }) {
        let beat = this.getBeat({ measureIndex, trackIndex, beatIndex });

        if (beat) {
            let beatNotes = beat.notes;
            return beatNotes.filter((note) => note.division.eq(division))[0];
        }
    }
    getSelectedNote() {
        return this.getNote({
            measureIndex: this.selectedMeasureIndex,
            trackIndex: this.selectedTrackIndex,
            beatIndex: this.selectedBeatIndex,
            division: this.selectedDivision
        });
    }
    deleteNote({ measureIndex, trackIndex, beatIndex, division }) {
        let beat = this.getBeat({ measureIndex, trackIndex, beatIndex });

        if (beat) {
            beat.notes = beat.notes.filter((note) => !note.division.eq(division));
        }
    }
};
