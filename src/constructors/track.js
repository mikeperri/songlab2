import _ from 'lodash';
import Beat from './beat.js';

export default class Track {
    constructor({ numberOfBeats, defaultTuplet }) {
        this.beats = _.range(numberOfBeats).map((index) => {
            return new Beat({
                tuplet: defaultTuplet
            });
        })
    }
};
