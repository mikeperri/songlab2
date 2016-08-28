import _ from 'lodash';
import isSharpKey from './isSharpKey.js';
import { SHARP_NOTE_NAMES, FLAT_NOTE_NAMES, NOTE_MODIFIERS, MAJOR_SCALE_INDICES, NOTE_NAME_TO_CHROMATIC_INDEX } from '../constants.js';

export default function getNoteName(degree, noteModifier, key) {
    let notes = isSharpKey(key) ? SHARP_NOTE_NAMES : FLAT_NOTE_NAMES;
    let keyOffset = NOTE_NAME_TO_CHROMATIC_INDEX[key];
    let noteIndex = (keyOffset + MAJOR_SCALE_INDICES[degree - 1]) % 12;
    let noteName = notes[noteIndex];

    if (noteModifier === NOTE_MODIFIERS.SHARP) {
        if (_.endsWith(noteName, 'b')) {
            return noteName.substring(0, 1);
        } else {
            return noteName + '#';
        }
    } else if (noteModifier === NOTE_MODIFIERS.FLAT) {
        if (_.endsWith(noteName, '#')) {
            return noteName.substring(0, 1);
        } else {
            return noteName + 'b';
        }
    } else {
        return noteName;
    }
};
