import React from 'react';
import MeasureView from '../MeasureView/';

export default React.createClass({
    propTypes: {
        keySignature: React.PropTypes.string,
        measures: React.PropTypes.arrayOf(React.PropTypes.shape({
            measure: MeasureView.propTypes.measure
        })),
        selectedMeasureIndex: React.PropTypes.number,
        selectedTrackIndex: React.PropTypes.number,
        selectedBeatIndex: React.PropTypes.number,
        selectedDivision: React.PropTypes.object,
        selectionResolution: React.PropTypes.number
    },
    render: function () {
        let lowerPitchLimit = 21;
        let upperPitchLimit = 60;

        let measureElements = this.props.measures.map((measure, index) => {
            let selection;

            if (index === this.props.selectedMeasureIndex) {
                selection = {
                    measure: (this.props.selectedBeatIndex === null),
                    trackIndex: this.props.selectedTrackIndex,
                    beatIndex: this.props.selectedBeatIndex,
                    division: this.props.selectedDivision,
                    resolution: this.props.selectionResolution
                };
            }

            return <MeasureView measure={measure}
                        selection={selection}
                        key={index}
                        lowerPitchLimit={lowerPitchLimit}
                        upperPitchLimit={upperPitchLimit} />
        });

        let placeholderSelection = null;

        if (this.props.selectedMeasureIndex >= this.props.measures.length) {
            placeholderSelection = <div className="selection"></div>;
        }

        return (
            <div className="song">
                {measureElements}
                <div className="measure-placeholder">
                    {placeholderSelection}
                </div>
            </div>
        );
    }
});
