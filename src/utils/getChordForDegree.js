import isSharpKey from './isSharpKey.js';
import { sharpNotes, flatNotes, majorScaleIndices, noteNameToChromaticIndex } from '../constants.js';

export default function getChordForDegree(key, degree) {
    let notes = isSharpKey(key) ? sharpNotes : flatNotes;
    let keyOffset = noteNameToChromaticIndex[key];
    let noteIndex = (keyOffset + majorScaleIndices[degree - 1]) % 12;

    return notes[noteIndex];
}
