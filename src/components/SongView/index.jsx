import React from 'react';
import Editor from '../../containers/Editor/';
import MeasureView from '../MeasureView/';

export default React.createClass({
    propTypes: {
        song: React.PropTypes.shape({
            key: React.PropTypes.string,
            measures: React.PropTypes.arrayOf(React.PropTypes.shape({
                measure: MeasureView.propTypes.measure
            })),
            selectedMeasureIndex: React.PropTypes.number,
            selectedBeatIndex: React.PropTypes.number,
        })
    },
    render: function () {
        let song = this.props.song;
        let lowerPitchLimit = 21;
        let upperPitchLimit = 33;

        let measureElements = song.measures.map((measure, index) => {
            let selection;

            if (index === song.selectedMeasureIndex) {
                selection = {
                    measure: (song.selectedBeatIndex === null),
                    beatIndex: song.selectedBeatIndex
                };
            }

            return <MeasureView measure={measure}
                        selection={selection}
                        key={index}
                        lowerPitchLimit={lowerPitchLimit}
                        upperPitchLimit={upperPitchLimit} />
        });

        let placeholderSelection = null;

        if (song.selectedMeasureIndex === song.measures.length) {
            let selectionStyle = {};

            if (song.selectedBeatIndex !== null) {
                selectionStyle.top = 5;
            }

            placeholderSelection = <div style={selectionStyle} className="selection"></div>;
        }

        return (
            <div className="song">
                {measureElements}
                <div className="measure placeholder">
                    {placeholderSelection}
                </div>
            </div>
        );
    }
});
