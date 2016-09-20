import React from 'react';
import { trackPropType } from '../../types/track.js';
import GridView from '../GridView/';

export default React.createClass({
    propTypes: {
        chordTrack: trackPropType,
        beatWidth: React.PropTypes.number,
        selectedBeatIndex: React.PropTypes.number,
        selectedDivisionIndex: React.PropTypes.number,
        selectionResolution: React.PropTypes.number
    },
    render: function () {
        let chordTrack = this.props.chordTrack;

        function getDivisionContents(beat, division) {
            let notes = beat.notes.filter((note) => {
                return note.division[0]/note.division[1] === division[0]/division[1];
            });

            return notes.map((note, noteIndex) => {
                return (
                    <div className="chord"
                        key={noteIndex}>
                        {note.chord}
                    </div>
                );
            });
        }

        return (
            <div className="chord-track">
                <GridView
                    track={this.props.chordTrack}
                    beatWidth={this.props.beatWidth}
                    selectedBeatIndex={this.props.selectedBeatIndex}
                    selectedDivisionIndex={this.props.selectedDivisionIndex}
                    selectionResolution={this.props.selectionResolution}
                    getDivisionContents={getDivisionContents} />
            </div>
        );
    }
});
