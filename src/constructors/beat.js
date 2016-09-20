export default class Beat {
    constructor({ notes = [], nextBeatNotes = [], tuplet = 1 }) {
        this.notes = [];
        this.addNotes(notes);
        this.nextBeatNotes = nextBeatNotes;
        this.tuplet = tuplet;
    }
    addNote(note) {
        for (var i = 0; i < this.notes.length; i++) {
            if (this.notes[i].division >= note.division) {
                this.notes.splice(i, 0, note);
                return;
            }
        }

        this.notes.push(note);
    }
    addNotes(notes) {
        notes.forEach(this.addNote.bind(this));
    }
};
