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
            notes: []
        };
    },
    initializeTapsAndNotes: function () {
        this.firstTapTime = null;
        this.taps = [];
        this.earlyNotes = [];
        this.pendingNotes = [];
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
            if (this.earlyNotes.length > 0) {
                this.flushEarlyNotes();
            }
        } else {
            this.quantizeBeat(this.pendingNotes, prevTap, tap);

            this.setState({
                notes: this.state.notes.concat(this.pendingNotes)
            });
            this.pendingNotes = [];
        }
    },
    handleNote: function () {
        let time = Date.now();

        if (this.taps.length === 0) {
            this.earlyNotes.push({
                time
            });
        } else {
            this.pendingNotes.push({
                time: time - this.firstTapTime
            });
        }
    },
    flushEarlyNotes: function () {
        this.pendingNotes = _.map(this.earlyNotes, (note) => {
            return {
                time: note.time - this.firstTapTime
            }
        });
        this.earlyNotes = [];
    },
    quantizeBeat: function (notes, tap1, tap2) {
        let period = this.getPeriod([tap1.time, tap2.time]);
        let divisionPeriod = period / this.state.beatDivisions;

        _.forEach(notes, (note) => {
            let rawDivision = (note.time - tap1.time) / divisionPeriod;
            let division = Math.round(rawDivision);
            let error = division - rawDivision;
            let beatIndex;

            if (division < this.state.beatDivisions) {
                beatIndex = tap1.index;
            } else {
                beatIndex = tap2.index;
                division = 0;
            }

            note.beatIndex = beatIndex;
            note.division = division;
            note.error = error;
        });
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
                notes: [],
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
                    notes={this.state.notes}
                />
                <div>
                    <button onClick={this.toggleRecording}>{recButtonText}</button>
                </div>
            </div>
        );
    }
});
