import React from 'react';
import { trackPropType } from '../../types/track.js';
import GridView from '../GridView/';

export default React.createClass({
    propTypes: {
        chordTrack: trackPropType,
        beatWidth: React.PropTypes.number,
        selection: React.PropTypes.object
    },
    render: function () {
        let chordTrack = this.props.chordTrack;

        function getContentForNote(note) {
            return note.chord;
        }

        return (
            <div className="chord-track">
                <GridView
                    track={this.props.chordTrack}
                    beatWidth={this.props.beatWidth}
                    selection={this.props.selection}
                    noteClassName="chord"
                    getContentForNote={getContentForNote} />
            </div>
        );
    }
});
