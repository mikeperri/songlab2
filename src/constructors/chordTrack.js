import Track from './track.js';
import Beat from './beat.js';
import Note from './note.js';

export default class ChordTrack extends Track {
    setChord(chord, beatIndex = 0, division = 0, divisionCount = 1) {
        let notes = this.beats[beatIndex].notes.filter((note) => note.division === division);

        if (notes.length > 0) {
            notes[0].chord = chord;
        } else {
            this.beats[beatIndex].addNote(new Note({
                division,
                divisionCount,
                chord
            }));
        }
    }
};
