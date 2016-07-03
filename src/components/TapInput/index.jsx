import React from 'react';
import _ from 'lodash';

import NoteGrid from '../NoteGrid';

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
                1.5: true,
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
            if (this.earlyNoteTimes.length > 0) {
                this.flushEarlyNotes();
            }
        } else if (this.pendingNoteTimes.length > 0) {
            let beat = this.quantizeBeat(
                this.state.beatDivisions,
                this.state.tuplets,
                this.pendingNoteTimes,
                prevTap,
                tap
            );

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
        let division = Math.round(rawDivision);
        let error = division - rawDivision;
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
    quantizeBeat: function (beatDivisions, tuplets, noteTimes, tap1, tap2) {
        console.log('note times', noteTimes);
        console.log('tap1 time', tap1.time);
        console.log('tap2 time', tap2.time);
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

        let bestTupletStr = _.minBy(_.keys(tupletToError), (tupletStr) => {
            return tupletToError[tupletStr];
        });
        let bestTuplet = Number(bestTupletStr);

        console.log('tte', tupletToError);
        console.log('ttn', tupletToNotes);

        let notes = tupletToNotes[bestTupletStr];
        _.forEach(notes, (note) => {
            if (note.nextBeat) {
                note.beatIndex = tap2.index;
                note.division = 0;
            } else {
                note.beatIndex = tap1.index;
            }

            delete note.nextBeat;
        });

        if (notes.length === 1 && notes[0].division === 0) {
            bestTuplet = 1;
        }

        console.log('notes', notes);

        return {
            notes,
            tuplet: bestTuplet
        };
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
