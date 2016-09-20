export default class Note {
    constructor({ division, divisionCount, error, nextBeat, pitch, chord }) {
        this.division = division;
        this.divisionCount = divisionCount;
        this.error = error;
        this.nextBeat = nextBeat;
        this.pitch = pitch;
        this.chord = chord;
    }
}
