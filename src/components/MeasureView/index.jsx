import React from 'react';
import _ from 'lodash';
import NoteGridView from '../NoteGridView/';

export default React.createClass({
    propTypes: {
        lowerPitchLimit: React.PropTypes.number,
        upperPitchLimit: React.PropTypes.number,
        measure: React.PropTypes.shape({
            chord: React.PropTypes.string,
            tracks: NoteGridView.propTypes.tracks
        })
    },
    getNumberOfBeats: function () {
        return 4;
    },
    render: function () {
        let measure = this.props.measure;
        let lowerPitchLimit = this.props.lowerPitchLimit;
        let upperPitchLimit = this.props.upperPitchLimit;

        let numberOfBeats = this.getNumberOfBeats();

        return (
            <div className="measure">
                <h2>{measure.chord}</h2>
                <NoteGridView
                    numberOfBeats={numberOfBeats}
                    tracks={measure.tracks}
                    lowerPitchLimit={lowerPitchLimit}
                    upperPitchLimit={upperPitchLimit} />
            </div>
        );
    }
});
