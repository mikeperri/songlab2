import _ from 'lodash';
import { MAX_RESOLUTION } from '../constants.js';

function check(resolution, tuplet, selectedDivision) {
    let denominator = tuplet * Math.pow(2, resolution);
    let numerators = _.range(0, denominator);

    return !_.isUndefined(_.find(numerators, (numerator) => {
        return selectedDivision.eq([numerator, denominator]);
    }));
}

export default function getNextSelectionResolutionAndTuplet({ selectedDivision, selectionResolution, selectionTuplet, tuplets }) {
    let resolutions = _.range(0, MAX_RESOLUTION);
    let nextSelectionResolution;
    let nextSelectionTuplet;

    if (check(selectionResolution, selectionTuplet, selectedDivision)) {
        nextSelectionResolution = selectionResolution;
        nextSelectionTuplet = selectionTuplet;
    } else {
        nextSelectionTuplet = _.find(tuplets, (tuplet) => {
            nextSelectionResolution = _.find(resolutions, (resolution) => {
                return check(resolution, tuplet, selectedDivision);
            });
            return !_.isUndefined(nextSelectionResolution);
        });
    }

    if (_.isUndefined(nextSelectionTuplet)) {
        throw new Error('Could not find an appropriate selection resolution & tuplet for selected division');
    } else {
        return {
            nextSelectionResolution,
            nextSelectionTuplet
        };
    }

}

