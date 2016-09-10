import _ from 'lodash';

export default class Track {
    constructor({ beats }) {
        if (_.isUndefined(beats)) {
            this.beats = [];
        } else {
            this.beats = beats;
        }
    }
};
