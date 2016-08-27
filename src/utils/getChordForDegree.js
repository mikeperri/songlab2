import isSharpKey from './isSharpKey.js';
import { sharpNotes, flatNotes, majorScaleIndices, majorScaleChordTypes, noteNameToChromaticIndex } from '../constants.js';

export default function getChordForDegree(key, degree) {
    let notes = isSharpKey(key) ? sharpNotes : flatNotes;
    let keyOffset = noteNameToChromaticIndex[key];
    let noteIndex = (keyOffset + majorScaleIndices[degree - 1]) % 12;
    let chordType = majorScaleChordTypes[degree - 1];

    return notes[noteIndex] + chordType;
}
