let sharpNotes = [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#' ];
let flatNotes = [ 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab' ];
let majorScaleIndices = [ 0, 2, 4, 5, 7, 9, 11 ];
let noteNameToChromaticIndex = {
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

export { sharpNotes, flatNotes, majorScaleIndices, noteNameToChromaticIndex };
