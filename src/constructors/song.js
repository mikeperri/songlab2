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
        this.inputMode = inputMode;
    }
    getNote({ measureIndex, trackIndex, beatIndex, division }) {
        let measure = this.measures[measureIndex]

        if (measure) {
            let track = measure.tracks[trackIndex];

            if (track) {
                let beatNotes = track.beats[beatIndex].notes;
                return beatNotes.filter((note) => note.division.eq(division))[0];
            }
        }
    }
};
