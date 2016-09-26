import _ from 'lodash';
import Measure from '../constructors/measure';
import Note from '../constructors/note';

export default function clonePath({ state, measureIndex, trackIndex, beatIndex, division }) {
    let nextState = _.clone(state);
    nextState.measures = _.clone(state.measures);

    if (!_.isUndefined(measureIndex)) {
        let nextMeasure = _.clone(nextState.measures[measureIndex]);
        if (!nextMeasure) nextMeasure = nextState.createDefaultMeasure();
        nextState.measures[measureIndex] = nextMeasure;
        nextMeasure.tracks = _.clone(nextMeasure.tracks);

        if (!_.isUndefined(trackIndex)) {
            let nextTrack = _.clone(nextMeasure.tracks[trackIndex]);
            nextMeasure.tracks[trackIndex] = nextTrack;
            nextTrack.beats = _.clone(nextTrack.beats);

            if (!_.isUndefined(beatIndex)) {
                let nextBeat = _.clone(nextTrack.beats[beatIndex]);
                nextTrack.beats[beatIndex] = nextBeat;
                nextBeat.notes = _.clone(nextBeat.notes);

                if (!_.isUndefined(division)) {
                    let filterFn = (n) => n.division.eq(division);
                    let nextNoteIndex = _.findIndex(nextBeat.notes, filterFn);
                    let nextNote = nextBeat.notes[nextNoteIndex];

                    if (!nextNote) {
                        nextBeat.addNote(state.createDefaultNote());
                    } else {
                        nextBeat.notes[nextNoteIndex] = _.clone(nextNote);
                    }
                }
            }
        }
    }

    return nextState;
}
