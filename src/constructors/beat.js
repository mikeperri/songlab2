export default class Beat {
    constructor({ notes = [] }) {
        this.notes = [];
        this.addNotes(notes);
    }
    addNote(note) {
        if (note) {
            for (var i = 0; i < this.notes.length; i++) {
                if (this.notes[i].division.gte(note.division)) {
                    this.notes.splice(i, 0, note);
                    return;
                }
            }

            this.notes.push(note);
        }
    }
    addNotes(notes) {
        notes.forEach(this.addNote.bind(this));
    }
    getNotesAfterDivision(division) {
        let filterFn = (n) => n.division.gt(division);
        return this.notes.filter(filterFn);
    }
};
