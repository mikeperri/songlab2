import React from 'react';
import _ from 'lodash';
import ChordTrackView from '../ChordTrackView/';
import NoteGridView from '../NoteGridView/';
import trackPropType from '../../propTypes/track.js';
import selectionPropType from '../../propTypes/selection.js';

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
        selection: selectionPropType
    },
    render: function () {
        let measure = this.props.measure;
        let lowerPitchLimit = this.props.lowerPitchLimit;
        let upperPitchLimit = this.props.upperPitchLimit;
        let numberOfBeats = measure.numberOfBeats;
        let selection = this.props.selection;
        let measureIsSelected = selection && selection.measure;
        let selectionElement;

        if (measureIsSelected) {
            let selectionStyle = {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            };
            selectionElement = <div className="selection" style={selectionStyle}></div>;
        }

        let trackElements = measure.tracks.map((track, trackIndex) => {
            let trackIsSelected = selection && !selection.measure && selection.trackIndex === trackIndex;
            let trackParams = track.getTrackParams();

            if (trackParams.type === 'chord') {
                return <ChordTrackView
                    chordTrack={track}
                    beatWidth={beatWidth}
                    selection={trackIsSelected ? selection : null}
                    key={trackIndex}
                    />;
            } else if (trackParams.type === 'note') {
                return <NoteGridView
                    track={track}
                    beatWidth={beatWidth}
                    numberOfBeats={numberOfBeats}
                    lowerPitchLimit={lowerPitchLimit}
                    upperPitchLimit={upperPitchLimit}
                    selection={trackIsSelected ? selection : null}
                    key={trackIndex}
                    />;
            }
        });

        return (
            <div className="measure">
                {selectionElement}
                <div>
                    {trackElements}
                </div>
            </div>
        );
    }
});
