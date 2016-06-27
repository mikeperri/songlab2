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
        it('should set the beatIndex, division, and error for each note in the beat', () => {
            wrapper.setState({
                'beatDivisions': 4,
                'tapTimes': [ 0, 100 ],
                'beatTimes': [ -1, 99 ]
            });

            let notes = [
                { time: 5 },
                { time: 40 },
                { time: 95 }
            ];

            wrapper.instance().quantizeBeat(
                notes,
                { time: 0, index: 5 },
                { time: 100, index: 6 }
            );

            expect(notes).to.deep.equal([
                {
                    time: 5,
                    beatIndex: 5,
                    division: 0,
                    error: -0.2
                },
                {
                    time: 40,
                    beatIndex: 5,
                    division: 2,
                    error: 0.3999999999999999
                },
                {
                    time: 95,
                    beatIndex: 6,
                    division: 0,
                    error: 0.20000000000000018
                }
            ]);
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

        it('should update notes after each tap (after the first)', () => {
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
            expect(wrapper.state('notes').length).to.equal(2);
        });
    });
});
