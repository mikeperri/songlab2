import {
    A_ZERO_MIDI_NUMBER,
    NOTE_NAME_TO_CHROMATIC_INDEX,
    MAJOR_SCALE_INDICES,
    NOTE_MODIFIERS
} from '../constants.js';

export default function getPitchForDegree({key, degree, modifier, octave}) {
    let pitch = 0;

    pitch += A_ZERO_MIDI_NUMBER;
    pitch += NOTE_NAME_TO_CHROMATIC_INDEX[key];
    pitch += MAJOR_SCALE_INDICES[degree - 1];

    if (modifier === NOTE_MODIFIERS.FLAT) {
        pitch -= 1;
    } else if (modifier === NOTE_MODIFIERS.SHARP) {
        pitch += 1;
    }

    pitch += (octave || 0) * 12;

    return pitch;
}
