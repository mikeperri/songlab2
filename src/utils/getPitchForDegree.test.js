import getPitchForDegree from './getPitchForDegree.js';
import { NOTE_MODIFIERS } from '../constants.js';
import { expect } from 'chai';

describe.only('getPitchForDegree', () => {
    it('should return 21 for the 1st degree in the key of A', () => {
        expect(getPitchForDegree({key: 'A', degree: 1})).to.equal(21);
    });

    it('should return 45 for the 1st degree in the key of A in octave 2', () => {
        expect(getPitchForDegree({key: 'A', degree: 1, octave: 2 })).to.equal(45);
    });

    it('should return 46 for the flat 2nd degree in the key of A in octave 2', () => {
        expect(getPitchForDegree({
            key: 'A',
            degree: 2,
            octave: 2, modifier: NOTE_MODIFIERS.FLAT
        })).to.equal(46);
    });

    it('should return 48 for the sharp 2nd degree in the key of A in octave 2', () => {
        expect(getPitchForDegree({
            key: 'A',
            degree: 2,
            octave: 2,
            modifier: NOTE_MODIFIERS.SHARP
        })).to.equal(48);
    });
});
