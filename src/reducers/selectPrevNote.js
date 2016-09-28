import _ from 'lodash';
import Division from '../constructors/division';
import getNextSelectionResolutionAndTuplet from '../utils/getNextSelectionResolutionAndTuplet';
import selectionLeft from './selectionLeft';

export default function selectPrevNote(state) {
    if (state.selectedTrackIndex === null) {
        return state;
    }

    let nextState = _.clone(state);

    if (!state.getSelectedMeasure()) {
        nextState.selectedMeasureIndex = state.selectedMeasureIndex - 1;
        nextState.selectedBeatIndex = nextState.getSelectedMeasure().numberOfBeats - 1;
        nextState.selectedDivision = new Division(1, 1);
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

        let { nextSelectionResolution, nextSelectionTuplet } = getNextSelectionResolutionAndTuplet({
            selectedDivision: nextState.selectedDivision,
            selectionResolution: state.selectionResolution,
            selectionTuplet: state.selectionTuplet,
            tuplets: state.tuplets
        });
        nextState.selectionResolution = nextSelectionResolution;
        nextState.selectionTuplet = nextSelectionTuplet;
    }

    return nextState;
}
