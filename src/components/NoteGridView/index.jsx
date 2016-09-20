import React from 'react';
import _ from 'lodash';
import { trackPropType } from '../../types/track.js';

export default React.createClass({
    propTypes: {
        numberOfBeats: React.PropTypes.number.isRequired,
        beatWidth: React.PropTypes.number.isRequired,
        tracks: React.PropTypes.arrayOf(trackPropType),
        lowerPitchLimit: React.PropTypes.number,
        upperPitchLimit: React.PropTypes.number,
    },
    render: function () {
        let numberOfBeats = this.props.numberOfBeats;
        let beatWidth = this.props.beatWidth;
        let tracks = this.props.tracks;
        let lowerPitchLimit = this.props.lowerPitchLimit;
        let upperPitchLimit = this.props.upperPitchLimit;

        let notes = [];
        let height = 200;
        let noteGridStyle = {
            height,
            width: beatWidth * numberOfBeats
        };

        tracks.forEach((track, trackIndex) => {
            track.beats.forEach((beat, beatIndex) => {
                let divisions = beat.tuplet === 1 ? 4 : beat.tuplet;

                beat.notes.forEach((note, noteIndex) => {
                    let noteStyle = {
                        position: 'absolute',
                        bottom: ((note.pitch - lowerPitchLimit) / (upperPitchLimit - lowerPitchLimit)) * height,
                        left: (beatIndex * beatWidth) + ((note.division/divisions) * beatWidth)
                    };

                    notes.push(
                        <div className="note"
                            style={noteStyle}
                            key={notes.length}>
                            N
                        </div>
                    );

                    noteIndex++;
                });
            });
        });

        return (
            <div className="note-grid"
                style={noteGridStyle}>
                {notes}
            </div>
        );
    }
});
