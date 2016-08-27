import React from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import { addToPitchOffset } from '../actions';
import { connect } from 'react-redux';
import RhythmGridView from '../components/RhythmGridView';

const PITCH_ROW_HEIGHT = 30;
const ROWS = 36;
const NOTE_NAMES = [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#' ];

let PitchSelector = React.createClass({
    getNoteNameForIndex: function (index, offset) {
        let netIndex = (index + offset) % 12;
        let octave = Math.floor((index + offset) / 12);

        return NOTE_NAMES[index % 12] + octave;
    },
    componentDidMount: function () {
        findDOMNode(this).scrollTop = PITCH_ROW_HEIGHT * 12;
    },
    render: function () {
        let pitchRows = [];

        _.times(ROWS + 1, (domIndex) => {
            let index = ROWS - domIndex;
            let noteName = this.getNoteNameForIndex(index, this.props.offset);

            pitchRows.push(
                <a className="button pitch-row" key={index}>{noteName}</a>
            );
        });

        return (
            <div className="pitch-selector">
                {pitchRows}
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        offset: state.pitch.offset
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUpOctave: () => {
            dispatch(addToPitchOffset(12));
        },
        onDownOctave: () => {
            dispatch(addToPitchOffset(-12));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PitchSelector);
