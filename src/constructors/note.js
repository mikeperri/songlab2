import _ from 'lodash';

export default class Note {
    constructor({ division, error, nextBeat, pitch, chord }) {
        this.division = division;
        this.error = error;
        this.nextBeat = nextBeat;

        if (!_.isUndefined(pitch)) {
            this.pitch = pitch;
        }

        if (!_.isUndefined(chord)) {
            this.chord = chord;
        }
    }
}
