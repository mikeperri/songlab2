import _ from 'lodash';
import Division from '../constructors/division';
import getNextSelectionResolutionAndTuplet from '../utils/getNextSelectionResolutionAndTuplet';
import selectionLeft from './selectionLeft';

export default function selectPrevNote(state) {
    if (state.selectedTrackIndex === null) {
        return state;
    }

    let nextState;

    if (!state.getSelectedMeasure()) {
        nextState = selectionLeft(state);
    } else {
        nextState = _.clone(state);
    }

    let notes = nextState.getSelectedBeat().getNotesBeforeDivision(nextState.selectedDivision);

    while (notes.length === 0) {
        if (nextState.selectedBeatIndex > 0) {
            nextState.selectedBeatIndex--;
        } else if (nextState.selectedMeasureIndex > 0) {
            nextState.selectedMeasureIndex--;
            nextState.selectedBeatIndex = nextState.getSelectedMeasure().numberOfBeats - 1;
        } else {
            break;
        }
        nextState.selectedDivision = new Division(0, 1);
        notes = nextState.getSelectedBeat().notes;
    }

    if (notes.length > 0) {
        nextState.selectedDivision = _.last(notes).division;
        let filterFn = (t) => t !== state.selectionTuplet;
        let tuplets = [ state.selectionTuplet ].concat(state.tuplets.filter(filterFn));

        let { nextSelectionResolution, nextSelectionTuplet } = getNextSelectionResolutionAndTuplet({
            selectedDivision: nextState.selectedDivision,
            selectionResolution: state.selectionResolution,
            tuplets
        });
        nextState.selectionResolution = nextSelectionResolution;
        nextState.selectionTuplet = nextSelectionTuplet;
    }

    return nextState;
}
