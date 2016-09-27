import React from 'react';
import getPitchForDegree from '../../utils/getPitchForDegree.js';
import { NOTE_MODIFIERS } from '../../constants.js';
const KEY_TO_DEGREE_AND_OCTAVE = {
    '1': { degree: 1, octave: 2 },
    '2': { degree: 2, octave: 2 },
    '3': { degree: 3, octave: 2 },
    '4': { degree: 4, octave: 2 },
    '5': { degree: 5, octave: 2 },
    '6': { degree: 6, octave: 2 },
    '7': { degree: 7, octave: 2 },
    'q': { degree: 1, octave: 1 },
    'w': { degree: 2, octave: 1 },
    'e': { degree: 3, octave: 1 },
    'r': { degree: 4, octave: 1 },
    't': { degree: 5, octave: 1 },
    'y': { degree: 6, octave: 1 },
    'u': { degree: 7, octave: 1 }
};

export default React.createClass({
    componentDidMount: function () {
        this.props.document.addEventListener('keydown', this.handleKeyDown);
        this.props.document.addEventListener('keyup', this.handleKeyUp);
    },
    componentWillUnmount: function () {
        this.props.document.removeEventListener('keydown', this.handleKeyDown);
        this.props.document.removeEventListener('keyup', this.handleKeyUp);
    },
    handleKeyDown: function (e) {
        if (e.key === 'ArrowUp') {
            this.modifier = NOTE_MODIFIERS.SHARP;
        } else if (e.key === 'ArrowDown') {
            this.modifier = NOTE_MODIFIERS.FLAT;
        } else {
            let degreeAndOctave = KEY_TO_DEGREE_AND_OCTAVE[e.key];

            if (degreeAndOctave) {
                let { degree, octave } = degreeAndOctave;
                let pitch = getPitchForDegree({
                    key: this.props.keySignature,
                    degree,
                    octave,
                    modifier: this.modifier
                });
                this.props.onInputPitch(pitch);
            }
        }
    },
    handleKeyUp: function (e) {
        if ((e.key === 'ArrowUp' && this.modifier === NOTE_MODIFIERS.SHARP)
            || (e.key === 'ArrowDown' && this.modifier === NOTE_MODIFIERS.FLAT)) {
            delete this.modifier;
        }
    },
    render: function () {
        return <div className="pitch-input"></div>;
    }
});
