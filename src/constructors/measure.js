import Track from './track.js';
import ChordTrack from './chordTrack.js';

export default class Measure {
    constructor({ numberOfBeats, chord }) {
        this.numberOfBeats = numberOfBeats;
        this.chordTrack = new ChordTrack({ numberOfBeats, defaultTuplet: 4, chord });
        this.tracks = [];
    }
};
