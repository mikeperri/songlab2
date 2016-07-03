import React from 'react';
import _ from 'lodash';

import NoteGrid from '../NoteGrid';
import Beat from './Beat';

export default React.createClass({
    getInitialState: function () {
        let beatDivisions = 4;
        let beatsPerMeasure = 4;

        this.intervalId = null;
        this.measures = 2;
        this.pxPerBeat = 100;

        this.initializeTapsAndNotes();

        return {
            recording: false,
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
        if (!this.state.recording) {
            return;
        } else if (e.key === 'Escape') {
            this.toggleRecording();
        } else {
            e.preventDefault();
        }

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
            let beat = this.quantizeBeat(
                this.state.beatDivisions,
                this.state.tuplets,
                this.pendingNoteTimes,
                prevTap,
                tap
            );

            beat.notes = beat.notes.concat(this.nextBeatNotes);
            this.nextBeatNotes = beat.nextBeatNotes;

            this.setState({
                beats: this.state.beats.concat(beat)
            });
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
    getNoteInfo: function (beatDivisions, period, tuplet, msIntoBeat) {
        let divisionCount = tuplet === 1 ? beatDivisions : tuplet;
        let divisionPeriod = period / divisionCount;

        let rawDivision = msIntoBeat / divisionPeriod;
        let division = Math.abs(Math.round(rawDivision));
        let error = (division - rawDivision) * divisionPeriod;
        let nextBeat = division == divisionCount;

        if (nextBeat) {
            division = 0;
        }

        return {
            division,
            error,
            nextBeat
        };
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
            return new Beat([], [], 1);
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

                return this.getNoteInfo(beatDivisions, period, tuplet, msIntoBeat);
            });

            tupletToNotes[tupletStr] = notes;
            tupletToError[tupletStr] = this.calculateNormalizedError(notes);
        });

        let bestTuplet = this.chooseBestTuplet(tupletToError);

        let notes = tupletToNotes[bestTuplet];
        let nextBeatNotes = _.filter(notes, { 'nextBeat': true });
        notes.splice(notes.length - nextBeatNotes.length);

        return new Beat(notes, nextBeatNotes, bestTuplet);
    },
    getPeriod: function (taps) {
        let sum = 0;

        for (let i = 0; i <= taps.length - 2; i++) {
            sum += taps[i + 1] - taps[i];
        }
        return sum / (taps.length - 1);
    },
    intervalCb: function () {
    },
    componentDidMount: function () {
        this.props.document.addEventListener('keydown', this.handleKeyDown);
    },
    componentWillUnmount: function () {
        this.props.document.removeEventListener('keydown', this.handleKeyDown);
    },
    toggleRecording: function () {
        if (this.state.recording) {
            this.setState({
                recording: false
            });
            this.intervalId = window.setInterval(this.intervalCb);
        } else {
            window.clearInterval(this.intervalId);
            this.initializeTapsAndNotes();
            this.setState({
                beats: [],
                recording: true
            });
        }
    },
    render: function () {
        let recButtonText = this.state.recording ? 'Stop' : 'Start';

        return (
            <div className="tap-input">
                <NoteGrid
                    measures={this.measures}
                    beatsPerMeasure={this.state.beatsPerMeasure}
                    beatDivisions={this.state.beatDivisions}
                    pxPerBeat={this.pxPerBeat}
                    beats={this.state.beats}
                />
                <div>
                    <button onClick={this.toggleRecording}>{recButtonText}</button>
                </div>
            </div>
        );
    }
});
