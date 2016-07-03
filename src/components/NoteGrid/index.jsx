import React from 'react';
import _ from 'lodash';

const MAX_ERROR = .15;

export default React.createClass({
    propTypes: {
        measures: React.PropTypes.number.isRequired,
        beatsPerMeasure: React.PropTypes.number.isRequired,
        beatDivisions: React.PropTypes.number.isRequired,
        pxPerBeat: React.PropTypes.number.isRequired,
        beats: React.PropTypes.array.isRequired
    },
    buildBackground: function (gridWidth) {
        let gridChildren = [];
        let d = this.props.beatsPerMeasure * this.props.beatDivisions * (this.props.measures + 1); // extra measure so we can scroll one over

        for (let i = 0; i < d; i++) {
            let x = i * (gridWidth / d);
            let bgVal = i % this.props.beatDivisions ? 191 : 15;
            let background = `rgb(${bgVal}, ${bgVal}, ${bgVal})`;
            let style = {
                left: x,
                background
            };

            gridChildren.push(
                <div className="grid-item" key={i} style={style}></div>
            );
        }

        return <div>{gridChildren}</div>;
    },
    buildNotes: function (beats) {
        let noteIndex = 0;
        let noteElements = _.flatMap(beats, (beat) => {
            return _.map(beat.notes, (note) => {
                let style = this.getNoteStyle(note, beat.tuplet);
                let text = beat.tuplet || '';

                if (note.error > MAX_ERROR) {
                    text += '>';
                } else if (note.error < -1 * MAX_ERROR) {
                    text += '<';
                }

                return <div className="grid-item note" key={noteIndex++} style={style}>{text}</div>;
            });
        });

        return <div>{noteElements}</div>;
    },
    getNoteStyle: function (note, tuplet) {
        let divisionCount = tuplet === 1 ? this.props.beatDivisions : tuplet;
        let divisionWidth = this.props.pxPerBeat / divisionCount;
        let left = note.beatIndex * this.props.pxPerBeat + note.division * divisionWidth;
        return {
            left
        };
    },
    render: function () {
        let gridWidth = (this.props.measures + 1) * this.props.beatsPerMeasure * this.props.pxPerBeat;
        let gridHeight = 200;

        let background = this.buildBackground(gridWidth);
        let notes = this.buildNotes(this.props.beats);

        return (
            <div className="note-grid" style={{ width: gridWidth, height: gridHeight}}>
                {background}
                {notes}
            </div>
        );
    }
});
