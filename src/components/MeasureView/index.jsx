import React from 'react';
import _ from 'lodash';
import ChordTrackView from '../ChordTrackView/';
import NoteGridView from '../NoteGridView/';
import { trackPropType } from '../../types/track.js';

const beatWidth = 50;

export default React.createClass({
    propTypes: {
        lowerPitchLimit: React.PropTypes.number,
        upperPitchLimit: React.PropTypes.number,
        measure: React.PropTypes.shape({
            numberOfBeats: React.PropTypes.number.isRequired,
            chordTrack: trackPropType,
            tracks: React.PropTypes.arrayOf(trackPropType)
        }),
        selection: React.PropTypes.shape({
            measure: React.PropTypes.bool,
            beatIndex: React.PropTypes.number
        })
    },
    render: function () {
        let measure = this.props.measure;
        let lowerPitchLimit = this.props.lowerPitchLimit;
        let upperPitchLimit = this.props.upperPitchLimit;
        let selection = this.props.selection;
        let numberOfBeats = measure.numberOfBeats;
        let selectionElement;

        if (selection) {
            if (selection.measure === true) {
                let selectionStyle = {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                };
                selectionElement = <div className="selection" style={selectionStyle}></div>;
            } else {
                let selectionStyle = {
                    top: 5,
                    left: selection.beatIndex * beatWidth,
                    width: beatWidth
                };
                selectionElement = <div className="selection" style={selectionStyle}></div>;
            }
        }

        return (
            <div className="measure">
                {selectionElement}
                <ChordTrackView
                    chordTrack={measure.chordTrack}
                    beatWidth={beatWidth}
                    selectedBeatIndex={selection && selection.beatIndex}
                    selectedDivisionIndex={selection && selection.divisionIndex}
                    selectionResolution={selection && selection.resolution}
                    />
                <NoteGridView
                    beatWidth={beatWidth}
                    numberOfBeats={numberOfBeats}
                    tracks={measure.tracks}
                    lowerPitchLimit={lowerPitchLimit}
                    upperPitchLimit={upperPitchLimit}
                    />
            </div>
        );
    }
});
