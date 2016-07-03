import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Input from '.';

describe('<Input />', () => {
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
            wrapper = mount(<Input document={mockDocument}/>);
        });
        it('should quantize four quarter notes, including one that goes to the next beat', () => {
            let beatDivisions = 4;
            let tuplets = { 1: true, 1.5: true, 3: true };
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

            expect(quantized).to.deep.equal({
                tuplet: 1,
                notes: [
                    {
                        division: 0,
                        error: 0,
                        beatIndex: 5
                    },
                    {
                        division: 1,
                        error: 0,
                        beatIndex: 5
                    },
                    {
                        division: 2,
                        error: 0,
                        beatIndex: 5
                    },
                    {
                        division: 3,
                        error: 0,
                        beatIndex: 5
                    },
                    {
                        division: 0,
                        error: 0,
                        beatIndex: 6
                    }
                ]
            });
        });
        it('should handle a triplet', () => {
            let beatDivisions = 4;
            let tuplets = { 1: true, 1.5: true, 3: true };
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
                        division: 0,
                        error: 0,
                        beatIndex: 5
                    },
                    {
                        division: 1,
                        error: 0.01000000000000012,
                        beatIndex: 5
                    },
                    {
                        division: 2,
                        error: 0.02000000000000024,
                        beatIndex: 5
                    }
                ]
            });
        });
    });
    describe('once started', () => {
        let wrapper, clock;
        beforeEach(() => {
            wrapper = mount(<Input document={mockDocument}/>);
            clock = sinon.useFakeTimers();
            wrapper.findWhere(n => n.type() === 'button' && n.text() === 'Start').simulate('click');
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
            expect(wrapper.state('beats').length).to.equal(2);
        });
    });
});
