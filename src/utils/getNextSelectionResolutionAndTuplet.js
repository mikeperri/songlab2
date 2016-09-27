import { MAX_RESOLUTION } from '../constants.js';

export default function getNextSelectionResolutionAndTuplet({ selectedDivision, selectionResolution, tuplets }) {
    let tupletIndex = 0;
    let tuplet;

    while (tupletIndex < tuplets.length) {
        tuplet = tuplets[tupletIndex];

        while (selectionResolution <= MAX_RESOLUTION) {
            if (tuplet * Math.pow(2, selectionResolution) % selectedDivision[1] === 0) {
                return {
                    nextSelectionResolution: selectionResolution,
                    nextSelectionTuplet: tuplet
                };
            }
            selectionResolution++;
        }

        tupletIndex++;
        selectionResolution = 0;
    }

    throw new Error('Not supposed to happen.');
}

