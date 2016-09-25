import _ from 'lodash';
import Beat from './beat.js';

export default class Track {
    constructor({ id, numberOfBeats, defaultTuplet, getTrackParams }) {
        this.id = id;
        this.beats = _.range(numberOfBeats).map((index) => {
            return new Beat({
                tuplet: defaultTuplet
            });
        });
        this.getTrackParams = _.partial(getTrackParams, id);
    }
};
