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
    getTrack({ measureIndex, trackIndex }) {
        let measure = this.getMeasure({ measureIndex });

        if (measure) {
            return measure.tracks[trackIndex];
        }
    }
    getBeat({ measureIndex, trackIndex, beatIndex }) {
        let track = this.getTrack({ measureIndex, trackIndex });

        if (track) {
            return track.beats[beatIndex];
        }
    }
    getNote({ measureIndex, trackIndex, beatIndex, division }) {
        let beat = this.getBeat({ measureIndex, trackIndex, beatIndex });

        if (beat) {
            let beatNotes = beat.notes;
            return beatNotes.filter((note) => note.division.eq(division))[0];
        }
    }
    deleteNote({ measureIndex, trackIndex, beatIndex, division }) {
        let beat = this.getBeat({ measureIndex, trackIndex, beatIndex });

        if (beat) {
            beat.notes = beat.notes.filter((note) => !note.division.eq(division));
        }
    }
};
