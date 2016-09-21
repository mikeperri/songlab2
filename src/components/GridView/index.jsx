import React from 'react';
import _ from 'lodash';
import { trackPropType } from '../../types/track.js';
import { MAX_RESOLUTION } from '../../constants.js';

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

        function getTransformStyle(beatIndex, division) {
            let x = (beatIndex * beatWidth) +
                ((division[0] / division[1]) * beatWidth);

            return `translateX(${x}px)`;
        }

        let noteCount = 0;
        let noteElements = _.flatMap(this.props.track.beats, (beat, beatIndex) => {
            return beat.notes.map((note, noteIndex) => {
                let transformStyle = getTransformStyle(beatIndex, note.division);
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
            let transformStyle = getTransformStyle(beatIndex, division);
            let selectionStyle = {
                transform: transformStyle,
                width: beatWidth / (1 << this.props.selection.resolution)
            };

            selectionElement = <div className="selection" style={selectionStyle}></div>;
        }

        let gridStyle = {
            width: beatWidth * this.props.track.beats.length
        };

        let markerElements = this.props.track.beats.map((beat, beatIndex) => {
            let transformStyle = getTransformStyle(beatIndex, [0, 1]);
            let markerStyle = { transform: transformStyle };

            return <div className="marker" style={markerStyle} key={beatIndex}></div>;
        });

        return (
            <div className="grid" style={gridStyle}>
                {markerElements}
                {selectionElement}
                {noteElements}
            </div>
        );
    }
});
