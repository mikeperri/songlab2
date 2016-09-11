let SHARP_NOTE_NAMES = [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#' ];
let FLAT_NOTE_NAMES = [ 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab' ];
let NOTE_MODIFIERS = {
    NATURAL: 0,
    FLAT: 1,
    SHARP: 2
};
let MAJOR_SCALE_INDICES = [ 0, 2, 4, 5, 7, 9, 11 ];
let CHORD_TYPES = {
    MAJOR: '',
    MINOR: 'm',
    DIMINISHED: 'dim'
};
let MAJOR_SCALE_CHORD_TYPES = [ CHORD_TYPES.MAJOR, CHORD_TYPES.MINOR, CHORD_TYPES.MINOR, CHORD_TYPES.MAJOR, CHORD_TYPES.MAJOR, CHORD_TYPES.MINOR, CHORD_TYPES.DIMINISHED ];
let NOTE_NAME_TO_CHROMATIC_INDEX = {
    'A': 0,
    'A#': 1,
    'Bb': 1,
    'B': 2,
    'C': 3,
    'C#': 4,
    'Db': 4,
    'D': 5,
    'D#': 6,
    'Eb': 6,
    'E': 7,
    'F': 8,
    'F#': 9,
    'Gb': 9,
    'G': 10,
    'G#': 11,
    'Ab': 11
};
let INPUT_MODES = {
    NORMAL: 'NORMAL',
    RHYTHM: 'RHYTHM',
    PITCH: 'PITCH'
};

export {
    SHARP_NOTE_NAMES,
    FLAT_NOTE_NAMES,
    NOTE_MODIFIERS,
    MAJOR_SCALE_INDICES,
    CHORD_TYPES,
    MAJOR_SCALE_CHORD_TYPES,
    NOTE_NAME_TO_CHROMATIC_INDEX,
    INPUT_MODES
};
