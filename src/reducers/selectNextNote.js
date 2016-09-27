import _ from 'lodash';
import Division from '../constructors/division';
import getNextSelectionResolutionAndTuplet from '../utils/getNextSelectionResolutionAndTuplet';

export default function selectNextNote(state) {
    if (!state.getSelectedBeat()) {
        return state;
    }

    let nextState = _.clone(state);
    let notes = state.getSelectedBeat().getNotesAfterDivision(state.selectedDivision);

    while (notes && notes.length === 0) {
        if (nextState.selectedBeatIndex < nextState.getSelectedMeasure().numberOfBeats - 1) {
            nextState.selectedBeatIndex++;
        } else {
            nextState.selectedMeasureIndex++;
            nextState.selectedBeatIndex = 0;
        }
        nextState.selectedDivision = new Division(0, 1);
        notes = nextState.getSelectedMeasure() && nextState.getSelectedBeat().notes;
    }

    if (notes && notes.length > 0) {
        nextState.selectedDivision = notes[0].division;
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
