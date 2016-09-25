import React from 'react';
import _ from 'lodash';
import trackPropType from '../../propTypes/track.js';
import selectionPropType from '../../propTypes/selection.js';
import GridView from '../GridView/';

export default React.createClass({
    propTypes: {
        numberOfBeats: React.PropTypes.number.isRequired,
        beatWidth: React.PropTypes.number.isRequired,
        track: trackPropType,
        lowerPitchLimit: React.PropTypes.number,
        upperPitchLimit: React.PropTypes.number,
        selection: selectionPropType
    },
    render: function () {
        let numberOfBeats = this.props.numberOfBeats;
        let beatWidth = this.props.beatWidth;
        let lowerPitchLimit = this.props.lowerPitchLimit;
        let upperPitchLimit = this.props.upperPitchLimit;

        let notes = [];
        let height = 200;
        let noteGridStyle = {
            height,
            width: beatWidth * numberOfBeats
        };

        let getContentForNote = (note) => {
            return "O";
        };

        let getStyleForNote = (note) => {
            let pitch = note.pitch || this.props.lowerPitchLimit;
            return {
                position: 'absolute',
                bottom: ((pitch - lowerPitchLimit) / (upperPitchLimit - lowerPitchLimit)) * height
            };
        }

        return (
            <div className="note-grid"
                style={noteGridStyle}>
                <GridView
                    track={this.props.track}
                    beatWidth={this.props.beatWidth}
                    selection={this.props.selection}
                    noteClassName="note"
                    getContentForNote={getContentForNote}
                    getStyleForNote={getStyleForNote} />
            </div>
        );
    }
});
