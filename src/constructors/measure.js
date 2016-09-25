import Track from './track.js';
import ChordTrack from './chordTrack.js';

function getTrackConstructor(type) {
    if (type ==='chord') {
        return ChordTrack;
    } else if (type === 'note') {
        return Track;
    }
}

export default class Measure {
    constructor({ numberOfBeats, defaultTuplet, chord, trackIds, getTrackParams }) {
        this.numberOfBeats = numberOfBeats;

        this.tracks = _.range(trackIds.length).map((id) => {
            let type = getTrackParams(id).type;
            let Constructor = getTrackConstructor(type);
            return new Constructor({ id, numberOfBeats, defaultTuplet, getTrackParams });
        });
    }
    getNote({ trackIndex, beatIndex, division }) {
        let track = this.tracks[trackIndex];

        if (track) {
            let beatNotes = track.beats[beatIndex].notes;
            return beatNotes.filter((note) => note.division.eq(division))[0];
        }
    }
    getChordTrack() {
        return this.tracks.filter((t) => t.getTrackParams().type === 'chord')[0];
    }
    setChord(chord) {
        let chordTrack = this.getChordTrack();

        if (chordTrack) {
            chordTrack.setChord({ chord });
        }
    }
};
