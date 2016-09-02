import React from 'react';
import _ from 'lodash';
import drag from './drag.js';

const MAX_ERROR = 100;

export default React.createClass({
    propTypes: {
        numberOfMeasures: React.PropTypes.number.isRequired,
        beatsPerMeasure: React.PropTypes.number.isRequired,
        beatDivisions: React.PropTypes.number.isRequired,
        pxPerBeat: React.PropTypes.number.isRequired,
        beats: React.PropTypes.array.isRequired,
        onNoteMove: React.PropTypes.func
    },
    getNumberOfDivisions: function (tuplet) {
        return tuplet === 1 ? this.props.beatDivisions : tuplet;
    },
    buildBackground: function (beats) {
        let gridChildren = [];
        let numberOfBeats = beats.length;
        let key = 0;

        _.forEach(beats, (beat, beatIndex) => {
            let divisions = this.getNumberOfDivisions(beat.tuplet);
            _.times(divisions, (divisionIndex) => {
                key++;
                let x = this.props.pxPerBeat * (beatIndex + (divisionIndex / divisions));
                let isBeat = divisionIndex === 0;
                let isMeasure = isBeat && (beatIndex % this.props.beatsPerMeasure) === 0;
                let bgVal = isMeasure ? 0 : (isBeat ? 85 : 170);
                let background;

                if (isMeasure || isBeat) {
                    background = 'rgb(85, 85, 85)';
                } else {
                    background = 'rgb(170, 170, 170)';
                }

                let width;
                if (isMeasure) {
                    width = 2;
                } else {
                    width = 1;
                }

                let outerStyle = {
                    transform: this.getTranslateX(x - 5).transform,
                    width: '10px',
                    paddingLeft: '5px'
                };
                let innerStyle = {
                    background,
                    width,
                    height: '100%'
                };

                let dropHandler = _.partial(this.dropHandler, beatIndex, divisionIndex);

                gridChildren.push(
                    <div onDragOver={this.dragOverHandler} onDrop={dropHandler} className="grid-item" key={key} style={outerStyle}>
                        <div style={innerStyle}></div>
                    </div>
                );
            });
        });

        return <div>{gridChildren}</div>;
    },
    buildNotes: function (beats) {
        let overallIndex = 0;
        let noteElements = _.flatMap(beats, (beat, beatIndex) => {
            return _.map(beat.notes, (note, noteIndex) => {
                let style = this.getNoteStyle(beatIndex, beat.tuplet, note.division);
                let text;

                if (note.error > MAX_ERROR) {
                    text = '>';
                } else if (note.error < -1 * MAX_ERROR) {
                    text = '<';
                } else {
                    text = '';
                }

                text += note.pitch;

                let dragHandler = _.partial(this.dragHandler, beatIndex, noteIndex);

                return <div onDragStart={dragHandler} className="grid-item note" draggable="true" key={overallIndex++} style={style}>{text}</div>;
            });
        });

        return <div>{noteElements}</div>;
    },
    getNoteStyle: function (beatIndex, tuplet, division) {
        let divisions = this.getNumberOfDivisions(tuplet);
        let x = this.props.pxPerBeat * (beatIndex + (division / divisions));

        return this.getTranslateX(x);
    },
    getTranslateX: function (x) {
        return {
            transform: `translateX(${x}px)`
        };
    },
    dragOverHandler: function (e) {
        e.preventDefault();
    },
    dragHandler: function (beatIndex, noteIndex, e) {
        e.dataTransfer.setData('text/plain', `${beatIndex}:${noteIndex}`);
        e.dataTransfer.effectAllowed = 'move';
    },
    dropHandler: function (destBeatIndex, destDivision, e) {
        let dt = e.dataTransfer.getData('text/plain');

        if (dt) {
            let dtParts = dt.split(':');
            let srcBeatIndex = dtParts[0];
            let srcNoteIndex = dtParts[1];

            let beats = _.cloneDeep(this.props.beats);
            let srcBeat = beats[srcBeatIndex];
            let destBeat = beats[destBeatIndex];
            let note = beats[srcBeatIndex].notes[srcNoteIndex];
            let existingNoteAtSameDivision = _.find(destBeat, { division: destDivision });

            let tuplet = 1; // todo

            if (!existingNoteAtSameDivision) {

                note.division = destDivision;

                if (Number(destBeatIndex) !== Number(srcBeatIndex)) {
                    _.pull(srcBeat.notes, note);
                    destBeat.notes.push(note);
                }

                this.props.onNoteMove(beats);
            }
        }
    },
    render: function () {
        let gridHeight = 200;

        let background = this.buildBackground(this.props.beats);
        let notes = this.buildNotes(this.props.beats);

        return (
            <div className="rhythm-grid"
                style={{ height: gridHeight}}>
                {background}
                {notes}
            </div>
        );
    }
});
