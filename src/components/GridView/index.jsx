import React from 'react';
import _ from 'lodash';
import { trackPropType } from '../../types/track.js';
import { MAX_RESOLUTION } from '../../constants.js';
import getTransformStyle from '../../utils/getTransformStyle.js';

import GridMarkers from '../GridMarkers/index.jsx';

export default React.createClass({
    propTypes: {
        track: trackPropType,
        beatWidth: React.PropTypes.number,
        selection: React.PropTypes.object,
        noteClassName: React.PropTypes.string,
        getContentForNote: React.PropTypes.func
    },
    render: function () {
        let beatWidth = this.props.beatWidth;

        let noteCount = 0;
        let noteElements = _.flatMap(this.props.track.beats, (beat, beatIndex) => {
            return beat.notes.map((note, noteIndex) => {
                let transformStyle = getTransformStyle(beatIndex, note.division, beatWidth);
                let noteStyle = { transform: transformStyle };

                return (
                    <div className={this.props.noteClassName}
                        style={noteStyle}
                        key={noteCount++}>
                        {this.props.getContentForNote(note)}
                    </div>
                );
            });
        });

        let selectionElement = null;

        if (this.props.selection) {
            let beatIndex = this.props.selection.beatIndex;
            let division = this.props.selection.division;
            let transformStyle = getTransformStyle(beatIndex, division, beatWidth);
            let selectionStyle = {
                transform: transformStyle,
                width: beatWidth / (1 << this.props.selection.resolution)
            };

            selectionElement = <div className="selection" style={selectionStyle}></div>;
        }

        let gridStyle = {
            width: beatWidth * this.props.track.beats.length
        };

        return (
            <div className="grid" style={gridStyle}>
                <GridMarkers beatWidth={beatWidth} beats={this.props.track.beats} />
                {selectionElement}
                {noteElements}
            </div>
        );
    }
});
