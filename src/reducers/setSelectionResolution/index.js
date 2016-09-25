import _ from 'lodash';
import { MAX_RESOLUTION } from '../../constants.js';

export default function setSelectionResolution(state, action) {
    let nextSelectionResolution = _.clamp(action.resolution, 0, MAX_RESOLUTION);
    let difference = nextSelectionResolution - state.selectionResolution;
    let division = state.selectedDivision;
    let nextDivision = _.clone(division);

    if (difference < 0) {
        nextDivision[0] = division[0] >> (-1 * difference);
    } else if (difference > 0) {
        nextDivision[0] = division[0] << difference;
    }

    nextDivision[1] = 1 << nextSelectionResolution;

    return Object.assign(_.clone(state), {
        selectionResolution: nextSelectionResolution,
        selectedDivision: nextDivision
    });
};
