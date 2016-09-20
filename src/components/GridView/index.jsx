import React from 'react';
import _ from 'lodash';
import { trackPropType } from '../../types/track.js';
import { MAX_RESOLUTION } from '../../constants.js';

export default React.createClass({
    propTypes: {
        track: trackPropType,
        beatWidth: React.PropTypes.number,
        selectedBeatIndex: React.PropTypes.number,
        selectedDivisionIndex: React.PropTypes.number,
        selectionResolution: React.PropTypes.number,
        getDivisionContents: React.PropTypes.func
    },
    render: function () {
        function divisionIsSelected(props, beatIndex, divisionIndex) {
            if (beatIndex === props.selectedBeatIndex) {
                if (props.selectionResolution === 1) {
                    return true;
                } else if (props.selectionResolution === MAX_RESOLUTION) {
                    return divisionIndex === props.selectedDivisionIndex;
                } else {
                    let factor = Math.pow(2, MAX_RESOLUTION - props.selectionResolution);
                    let scaledDivisionIndex = props.selectedDivisionIndex * factor;
                    let limit = scaledDivisionIndex + factor;
                    return divisionIndex >= scaledDivisionIndex && divisionIndex < limit;
                }
            }

            return beatIndex === props.selectedBeatIndex
                && divisionIndex === props.selectedDivisionIndex;
        }

        let divisions = this.props.track.beats.map((beat, beatIndex) => {
            let beatDivisionCount = beat.tuplet * Math.pow(2, MAX_RESOLUTION - 1);

            let beatDivisions = _.range(beatDivisionCount).map((divisionIndex) => {
                let divisionStyle = {
                    width: this.props.beatWidth / beatDivisionCount
                };
                let divisionClassNames = ['division'];

                if (divisionIsSelected(this.props, beatIndex, divisionIndex)) {
                    divisionClassNames.push('selected');
                }

                return (
                    <div className={divisionClassNames.join(' ')}
                        key={divisionIndex}
                        style={divisionStyle}>
                        {this.props.getDivisionContents(beat, [divisionIndex, beatDivisionCount])}
                    </div>
                );
            });

            return (
                <div className="beat"
                    key={beatIndex}>
                    {beatDivisions}
                </div>
            );
        });

        return (
            <div className="grid">
                {divisions}
            </div>
        );
    }
});
