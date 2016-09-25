import Division from '../constructors/division';

export default function selectionRight(state) {
    let nextSong = _.clone(state);
    let selectedMeasure = nextSong.measures[state.selectedMeasureIndex];

    function tryToIncrementMeasure() {
        if (state.selectedMeasureIndex < state.measures.length) {
            nextSong.selectedMeasureIndex++;
            return true;
        } else {
            return false;
        }
    }

    function tryToIncrementBeat() {
        if (state.selectedBeatIndex < selectedMeasure.numberOfBeats - 1) {
            nextSong.selectedBeatIndex++;
            return true;
        } else {
            let incremented = tryToIncrementMeasure();
            if (incremented) {
                nextSong.selectedBeatIndex = 0;
            }
            return incremented;
        }
    }

    function tryToIncrementDivision() {
        if (state.selectionResolution > 0 || state.selectionTuplet !== 1) {
            let denominator = (1 << state.selectionResolution) * state.selectionTuplet;
            let nextDivision = new Division(state.selectedDivision[0] + 1, denominator);

            if (nextDivision[0] < nextDivision[1]) {
                nextSong.selectedDivision = nextDivision;
            } else {
                let incremented = tryToIncrementBeat();
                if (incremented) {
                    nextDivision[0] = 0;
                    nextDivision[1] = 1;
                    nextSong.selectedDivision = nextDivision;
                }
            }
        } else {
            tryToIncrementBeat();
        }
    }

    if (selectedMeasure) {
        if (state.selectedBeatIndex !== null) {
            tryToIncrementDivision();
        } else {
            tryToIncrementMeasure();
        }
    }

    return nextSong;
};
