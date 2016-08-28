const digitRegex = /^[1-7]$/;
const shiftedKeys = [ '!', '@', '#', '$', '%', '^', '&' ];

export default function keyboardEventToDegree(e) {
    if (e.key) {
        if (digitRegex.test(e.key)) {
            return Number.parseInt(e.key);
        } else if (shiftedKeys.indexOf(e.key) !== -1) {
            return shiftedKeys.indexOf(e.key) + 1;
        }
    } else if (e.keyCode >= 49 && e.keyCode <= 55) {
        // deprecated - for Safari support
        return e.keyCode - 48;
    }
};
