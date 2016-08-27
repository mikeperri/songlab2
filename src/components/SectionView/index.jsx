import React from 'react';
import Editor from '../../containers/Editor/';
import MeasureView from '../MeasureView/';

export default React.createClass({
    propTypes: {
        lowerPitchLimit: React.PropTypes.number,
        upperPitchLimit: React.PropTypes.number,
        sections: React.PropTypes.arrayOf(React.PropTypes.shape({
            measure: MeasureView.propTypes.measure
        }))
    },
    render: function () {
        let section = this.props.section;
        let lowerPitchLimit = this.props.lowerPitchLimit;
        let upperPitchLimit = this.props.upperPitchLimit;

        let measureElements = section.measures.map((measure, index) => {
            return <MeasureView measure={measure}
                        key={index}
                        lowerPitchLimit={lowerPitchLimit}
                        upperPitchLimit={upperPitchLimit} />
        });

        return (
            <div className="section">
                {measureElements}
            </div>
        );
    }
});
