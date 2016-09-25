import _ from 'lodash';
import Beat from './beat.js';

export default class Track {
    constructor({ id, numberOfBeats, defaultTuplet, getTrackParams }) {
        this.id = id;
        this.tuplets = _.range(numberOfBeats).map(() => defaultTuplet);
        this.beats = _.range(numberOfBeats).map((index) => {
            return new Beat({});
        });
        this.getTrackParams = _.partial(getTrackParams, id);
    }
    deleteNote({ beatIndex, division }) {
        let beat = this.beats[beatIndex];
        beat.notes = beat.notes.filter((note) => !note.division.eq(division));
    }
};
