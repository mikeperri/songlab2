import React from 'react';
import _ from 'lodash';

// Each track must have the same number of beats

export default React.createClass({
    propTypes: {
        numberOfBeats: React.PropTypes.number,
        tracks: React.PropTypes.arrayOf(React.PropTypes.shape({
            beats: React.PropTypes.arrayOf(React.PropTypes.shape({
                tuplet: React.PropTypes.number,
                notes: React.PropTypes.arrayOf(React.PropTypes.shape({
                    division: React.PropTypes.number,
                    pitch: React.PropTypes.number
                }))
            }))
        })),
        lowerPitchLimit: React.PropTypes.number,
        upperPitchLimit: React.PropTypes.number
    },
    render: function () {
        let numberOfBeats = this.props.numberOfBeats;
        let tracks = this.props.tracks;
        let lowerPitchLimit = this.props.lowerPitchLimit;
        let upperPitchLimit = this.props.upperPitchLimit;
        let notes = [];
        let beatWidth = 50;
        let height = 200;
        let noteGridStyle = {
            height,
            width: beatWidth * numberOfBeats
        };

        tracks.forEach((track, trackIndex) => {
            track.beats.forEach((beat, beatIndex) => {
                beat.notes.forEach((note, noteIndex) => {
                    let noteStyle = {
                        position: 'absolute',
                        bottom: ((note.pitch - lowerPitchLimit) / (upperPitchLimit - lowerPitchLimit)) * height,
                        left: (beatIndex * beatWidth) + ((note.division/beat.tuplet) * beatWidth)
                    };

                    notes.push(
                        <div className="note"
                            style={noteStyle}
                            key={notes.length}>
                            N
                        </div>
                    );
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
