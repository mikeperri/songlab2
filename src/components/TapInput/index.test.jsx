import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import TapInput from '.';
import Division from '../../constructors/division';

describe('<TapInput />', () => {
    let keydownCb;
    const mockDocument = {
        addEventListener: function (eventName, cb) {
            if (eventName === 'keydown') {
                keydownCb = cb;
            }
        },
        removeEventListener: sinon.spy()
    }
    describe('the quantizeBeat function', () => {
        let wrapper;
        beforeEach(() => {
            wrapper = mount(<TapInput document={mockDocument}/>);
        });
        it('should quantize five quarter notes, where the last one should go to the next beat', () => {
            let beatDivisions = 4;
            let tuplets = { 1: true, 3: true };
            let noteTimes = [ 0, 25, 50, 75, 100 ];
            let tap1 = { time: 0, index: 5 };
            let tap2 = { time: 100, index: 6 };

            let quantized = wrapper.instance().quantizeBeat(
                beatDivisions,
                tuplets,
                noteTimes,
                tap1,
                tap2
            );

            //expect(quantized.notes.length).to.equal(4);
            //expect(quantized.nextBeatNotes.length).to.equal(1);
            expect(quantized).to.deep.equal({
                tuplet: 1,
                notes: [
                    {
                        division: new Division(0, 4),
                        error: 0,
                        nextBeat: false
                    },
                    {
                        division: new Division(1, 4),
                        error: 0,
                        nextBeat: false
                    },
                    {
                        division: new Division(2, 4),
                        error: 0,
                        nextBeat: false
                    },
                    {
                        division: new Division(3, 4),
                        error: 0,
                        nextBeat: false
                    }
                ],
                nextBeatNotes: [
                    {
                        division: new Division(0, 4),
                        error: 0,
                        nextBeat: true
                    }
                ]
            });
        });
        it('should handle a triplet', () => {
            let beatDivisions = 4;
            let tuplets = { 1: true, 3: true };
            let noteTimes = [ 0, 33, 66 ];
            let tap1 = { time: 0, index: 5 };
            let tap2 = { time: 100, index: 6 };

            let quantized = wrapper.instance().quantizeBeat(
                beatDivisions,
                tuplets,
                noteTimes,
                tap1,
                tap2
            );

            expect(quantized).to.deep.equal({
                tuplet: 3,
                notes: [
                    {
                        division: new Division(0, 3),
                        error: 0,
                        nextBeat: false
                    },
                    {
                        division: new Division(1, 3),
                        error: 0.33333333333333737,
                        nextBeat: false
                    },
                    {
                        division: new Division(2, 3),
                        error: 0.6666666666666747,
                        nextBeat: false
                    }
                ],
                nextBeatNotes: []
            });
        });
        it('should not say a single note at the beat is a tuplet', () => {
            let beatDivisions = 4;
            let tuplets = { 1: true, 3: true };
            let noteTimes = [ 0 ];
            let tap1 = { time: 5, index: 5 };
            let tap2 = { time: 100, index: 6 };

            let quantized = wrapper.instance().quantizeBeat(
                beatDivisions,
                tuplets,
                noteTimes,
                tap1,
                tap2
            );

            expect(quantized).to.deep.equal({
                tuplet: 1,
                notes: [
                    {
                        division: new Division(0, 4),
                        error: 5,
                        nextBeat: false
                    }
                ],
                nextBeatNotes: []
            });
        });
    });
    describe('once started', () => {
        let wrapper, clock, setBeatsCb;
        beforeEach(() => {
            setBeatsCb = sinon.spy()
            wrapper = mount(<TapInput document={mockDocument} onSetBeats={setBeatsCb}/>);
            clock = sinon.useFakeTimers();
        });

        afterEach(() => {
            clock.restore();
        });

        it('should update beats after each tap (after the first)', () => {
            let preventDefault = sinon.spy();

            clock.tick(111);
            keydownCb({ key: ' ', preventDefault });
            clock.tick(10);
            keydownCb({ key: 'a', preventDefault });
            clock.tick(90);
            keydownCb({ key: ' ', preventDefault });
            clock.tick(50);
            keydownCb({ key: 'a', preventDefault });
            clock.tick(50);
            keydownCb({ key: ' ', preventDefault });

            expect(setBeatsCb.getCalls().length).to.equal(2);
            expect(setBeatsCb.firstCall.args[0].length).to.equal(1);
            expect(setBeatsCb.secondCall.args[0].length).to.equal(1);
        });

        it('should create an empty beat when no notes are registered during the beat', () => {
            let preventDefault = sinon.spy();

            clock.tick(111);
            keydownCb({ key: ' ', preventDefault });
            clock.tick(100);
            keydownCb({ key: ' ', preventDefault });
            clock.tick(100);
            keydownCb({ key: ' ', preventDefault });

            expect(setBeatsCb.getCalls().length).to.equal(2);
            expect(setBeatsCb.firstCall.args[0].length).to.equal(1);
            expect(setBeatsCb.secondCall.args[0].length).to.equal(1);
        });

        it('should handle an early note', () => {
            let preventDefault = sinon.spy();

            clock.tick(111);
            keydownCb({ key: 'a', preventDefault });
            clock.tick(10);
            keydownCb({ key: ' ', preventDefault });
            clock.tick(90);
            keydownCb({ key: ' ', preventDefault });
            clock.tick(100);
            keydownCb({ key: ' ', preventDefault });

            expect(setBeatsCb.getCalls().length).to.equal(2);

            let firstBeat = setBeatsCb.firstCall.args[0][0];
            expect(firstBeat.notes[0].division[0]).to.equal(0);
        });
    });
});
