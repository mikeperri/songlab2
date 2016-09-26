import _ from 'lodash';
import clonePath from '../utils/clonePath';

export default function setNote(state, action) {
    let selectedTrackIndex = state.selectedTrackIndex || 0;
    let selectedBeatIndex = state.selectedBeatIndex || 0;

    let nextState = clonePath({
        state,
        measureIndex: state.selectedMeasureIndex,
        trackIndex: selectedTrackIndex,
        beatIndex: selectedBeatIndex,
        division: state.selectedDivision
    });

    let note = nextState.getNote({
        measureIndex: state.selectedMeasureIndex,
        trackIndex: selectedTrackIndex,
        beatIndex: selectedBeatIndex,
        division: state.selectedDivision
    });

    Object.assign(note, action.noteParams);

    return nextState;
};
