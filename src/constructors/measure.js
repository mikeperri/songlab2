import Track from './track.js';
import ChordTrack from './chordTrack.js';

export default class Measure {
    constructor({ numberOfBeats, chord }) {
        this.numberOfBeats = numberOfBeats;
        this.chordTrack = new ChordTrack({ numberOfBeats, defaultTuplet: 1, chord });
        this.tracks = [];
    }
    setChord(chord) {
        this.chordTrack.setChord(chord);
    }
};
