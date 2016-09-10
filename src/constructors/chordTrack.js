export default class ChordTrack {
    constructor({ numberOfBeats, defaultTuplet, chord }) {
        this.beats = _.range(numberOfBeats).map((index) => {
            let beat = {
                tuplet: defaultTuplet,
                notes: []
            };

            if (chord && index === 0) {
                beat.notes.push({
                    division: 0,
                    chord
                });
            }

            return beat;
        })
    }
};
