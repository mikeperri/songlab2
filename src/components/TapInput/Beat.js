export default class Beat {
    constructor({ notes = [], nextBeatNotes = [], tuplet = 1 }) {
        this.notes = notes;
        this.nextBeatNotes = nextBeatNotes;
        this.tuplet = tuplet;
    }
};
