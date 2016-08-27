const sharpKeys = [
    'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F#', 'G', 'G#'
];

export default function isSharpKey(key) {
    return sharpKeys.indexOf(key) !== -1;
};
