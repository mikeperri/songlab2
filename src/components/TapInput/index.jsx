import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { setBeats } from '../../actions/';

import RhythmGridView from '../../components/RhythmGridView/';
import Beat from '../../constructors/beat.js';
import Note from '../../constructors/note.js';
import Division from '../../constructors/division';
import { INPUT_MODES } from '../../constants.js';

const PX_PER_BEAT = 100;

export default React.createClass({
    getInitialState: function () {
        let beatDivisions = 4;
        let beatsPerMeasure = 4;

        this.intervalId = null;
        this.measures = 2;

        this.initializeTapsAndNotes();

        let beats = _.times(this.measures * beatsPerMeasure, () => new Beat({}));

        return {
            beatDivisions,
            beatsPerMeasure,
            beats: [],
            tuplets: {
                1: true,
                3: true,
                5: false
            }
        };
    },
    initializeTapsAndNotes: function () {
        this.firstTapTime = null;
        this.taps = [];
        this.earlyNoteTimes = [];
        this.pendingNoteTimes = [];
        this.nextBeatNotes = [];
    },
    handleKeyDown: function (e) {
        if (e.key === ' ') {
            this.handleTap();
        } else {
            this.handleNote();
        }
    },
    handleTap: function () {
        let time = Date.now();

        if (this.taps.length === 0) {
            this.firstTapTime = time;
        }

        let prevTap = _.last(this.taps);
        let index = prevTap ? prevTap.index + 1 : 0;
        let tap = {
            time: time - this.firstTapTime,
            index
        };

        this.taps.push(tap);

        if (this.taps.length === 1) {
            this.flushEarlyNotes();
        } else {
            let { notes, nextBeatNotes, tuplet } = this.quantizeBeat(
                this.state.beatDivisions,
                this.state.tuplets,
                this.pendingNoteTimes,
                prevTap,
                tap
            );
            let beat = new Beat({ notes, nextBeatNotes });

            beat.addNotes(this.nextBeatNotes);
            this.nextBeatNotes = beat.nextBeatNotes;

            this.props.onSetBeat(beat);
            this.pendingNoteTimes = [];
        }
    },
    handleNote: function () {
        let time = Date.now();

        if (this.taps.length === 0) {
            this.earlyNoteTimes.push(time);
        } else {
            let relativeTime = time - this.firstTapTime;
            this.pendingNoteTimes.push(relativeTime);
        }
    },
    flushEarlyNotes: function () {
        this.pendingNoteTimes = _.map(this.earlyNoteTimes, (noteTime) => {
            return noteTime - this.firstTapTime;
        });
        this.earlyNoteTimes = [];
    },
    buildNote: function (beatDivisions, period, tuplet, msIntoBeat) {
        let divisionCount = tuplet === 1 ? beatDivisions : tuplet;
        let divisionPeriod = period / divisionCount;

        let rawDivision = msIntoBeat / divisionPeriod;
        let divisionNumerator = Math.abs(Math.round(rawDivision));
        let error = (divisionNumerator - rawDivision) * divisionPeriod;
        let nextBeat = divisionNumerator == divisionCount;

        if (nextBeat) {
            divisionNumerator = 0;
        }

        let note = new Note({
            division: new Division(divisionNumerator, divisionCount),
            error,
            nextBeat
        });
        return note;
    },
    calculateNormalizedError: function (notes) {
        let sum = _.sumBy(notes, (note) => note.error);
        let avg = sum / notes.length;
        let avgDeviation = _.sumBy(notes, (note) => Math.abs(avg - note.error)) / notes.length;

        // totally arbitrary.
        return Math.abs(avg) + Math.pow(avgDeviation, 2);
    },
    chooseBestTuplet: function (tupletToError) {
        let bestTupletStr = _.minBy(_.keys(tupletToError), (tupletStr) => {
            let weight = tupletStr === '1' ? 0.8 : 1;

            return tupletToError[tupletStr] * weight;
        });

        return Number(bestTupletStr);
    },
    quantizeBeat: function (beatDivisions, tuplets, noteTimes, tap1, tap2) {
        if (noteTimes.length === 0) {
            return new Beat({});
        }

        let period = this.getPeriod([tap1.time, tap2.time]);
        let activeTuplets = _(tuplets)
           .pickBy((t) => t === true)
           .keys()
           .value();
        let tupletToNotes = {};
        let tupletToError = {};

        _.forEach(activeTuplets, (tupletStr) => {
            let tuplet = Number(tupletStr);
            let notes = _.map(noteTimes, (noteTime) => {
                let msIntoBeat = noteTime - tap1.time;

                return this.buildNote(beatDivisions, period, tuplet, msIntoBeat);
            });

            tupletToNotes[tupletStr] = notes;
            tupletToError[tupletStr] = this.calculateNormalizedError(notes);
        });

        let bestTuplet = this.chooseBestTuplet(tupletToError);
        let allNotes = tupletToNotes[bestTuplet];
        let notes = _.reject(allNotes, { 'nextBeat': true });
        let nextBeatNotes = _.filter(allNotes, { 'nextBeat': true });

        return { notes, nextBeatNotes, tuplet: bestTuplet };
    },
    getPeriod: function (taps) {
        let sum = 0;

        for (let i = 0; i <= taps.length - 2; i++) {
            sum += taps[i + 1] - taps[i];
        }
        return sum / (taps.length - 1);
    },
    componentDidMount: function () {
        this.props.document.addEventListener('keydown', this.handleKeyDown);
    },
    componentWillUnmount: function () {
        this.props.document.removeEventListener('keydown', this.handleKeyDown);
    },
    render: function () {
        return (
            <div className="tap-input">
            </div>
        );
    }
});
