import Track from './track.js';
import Beat from './beat.js';
import Note from './note.js';
import Division from './division';

export default class ChordTrack extends Track {
    setChord({ chord, beatIndex = 0, division = new Division(0, 1) }) {
        let allNotes = this.beats[beatIndex].notes;
        let note = allNotes.filter((note) => note.division.eq(division))[0];

        if (note) {
            note.chord = chord;
        } else {
            this.beats[beatIndex].addNote(new Note({
                division,
                chord
            }));
        }
    }
    deleteChord({ beatIndex, division }) {
        let beat = this.beats[beatIndex];
        beat.notes = beat.notes.filter((note) => !note.division.eq(division));
    }
};
