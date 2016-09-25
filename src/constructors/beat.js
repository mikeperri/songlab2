export default class Beat {
    constructor({ notes = [], nextBeatNotes = [] }) {
        this.notes = [];
        this.addNotes(notes);
        this.nextBeatNotes = nextBeatNotes;
    }
    addNote(note) {
        for (var i = 0; i < this.notes.length; i++) {
            if (this.notes[i].division.gte(note.division)) {
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
