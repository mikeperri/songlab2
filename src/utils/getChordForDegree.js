import _ from 'lodash';
import isSharpKey from './isSharpKey.js';
import getNoteName from './getNoteName.js';
import { NOTE_MODIFIERS, CHORD_TYPES, CHORD_TYPE_TO_NAME, MAJOR_SCALE_CHORD_TYPES } from '../constants.js';

const MODIFIERS = {
    SWITCH_MAJOR_MINOR: 0,
    FLAT: 1,
    SHARP: 2
};

export { MODIFIERS as CHORD_MODIFIERS };

export default function getChordForDegree(key, degree, modifiers) {
    let noteName;
    let noteModifier;
    let chordType = MAJOR_SCALE_CHORD_TYPES[degree - 1];

    if (_.includes(modifiers, MODIFIERS.SWITCH_MAJOR_MINOR)) {
        if (chordType === CHORD_TYPES.MAJOR) {
            chordType = CHORD_TYPES.MINOR;
        } else if (chordType === CHORD_TYPES.MINOR) {
            chordType = CHORD_TYPES.MAJOR;
        }
    }

    if (_.includes(modifiers, MODIFIERS.FLAT)) {
        noteModifier = NOTE_MODIFIERS.FLAT;
        chordType = CHORD_TYPES.MAJOR;
    } else if (_.includes(modifiers, MODIFIERS.SHARP)) {
        noteModifier = NOTE_MODIFIERS.SHARP;
        chordType = CHORD_TYPES.DIMINISHED;
    }

    noteName = getNoteName(degree, noteModifier, key);

    return noteName + chordType;
};
