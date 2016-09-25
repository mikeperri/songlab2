import React from 'react';
import trackPropType from '../../propTypes/track.js';
import selectionPropType from '../../propTypes/selection.js';
import GridView from '../GridView/';

export default React.createClass({
    propTypes: {
        chordTrack: trackPropType,
        beatWidth: React.PropTypes.number,
        selection: selectionPropType
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
