import Division from '../constructors/division';

export default function selectionLeft(state) {
    let nextSong = _.clone(state);
    let selectedMeasure = nextSong.measures[state.selectedMeasureIndex];

    function tryToDecrementMeasure() {
        if (state.selectedMeasureIndex > 0) {
            if (state.selectedMeasureIndex >= state.measures.length) {
                nextSong.selectedMeasureIndex = state.measures.length - 1;
            } else {
                nextSong.selectedMeasureIndex--;
            }
            return true;
        } else {
            return false;
        }
    }

    function tryToDecrementBeat() {
        if (state.selectedBeatIndex > 0) {
            nextSong.selectedBeatIndex--;
            return true;
        } else {
            let decremented = tryToDecrementMeasure();
            if (decremented) {
                selectedMeasure = nextSong.measures[nextSong.selectedMeasureIndex];
                nextSong.selectedBeatIndex = selectedMeasure.numberOfBeats - 1;
            }
            return decremented;
        }
    }

    function tryToDecrementDivision() {
        if (state.selectionResolution > 0 || state.selectionTuplet !== 1) {
            let denominator = (1 << state.selectionResolution) * state.selectionTuplet;
            let nextDivision = new Division(state.selectedDivision[0] - 1, denominator);

            if (nextDivision[0] >= 0) {
                nextSong.selectedDivision = nextDivision;
            } else {
                let decremented = tryToDecrementBeat();
                if (decremented) {
                    nextDivision[0] = nextDivision[1] - 1;
                    nextSong.selectedDivision = nextDivision;
                }
            }
        } else {
            tryToDecrementBeat();
        }
    }

    if (state.selectedBeatIndex !== null) {
        tryToDecrementDivision();
    } else {
        tryToDecrementMeasure();
    }

    return nextSong;
}
