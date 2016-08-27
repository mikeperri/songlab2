import React from 'react';
import { connect } from 'react-redux';
import EditableRhythmGrid from '../EditableRhythmGrid';
import UndoRedo from '../UndoRedo';
import TapInput from '../TapInput/';
import PitchSelector from '../PitchSelector';
import { MODES } from './constants';
import { setMode } from '../../actions';

let Editor = React.createClass({
    render: function () {
        let mode = this.props.mode;

        if (mode === MODES.RHYTHM) {
            return (
                <div className="editor">
                    <EditableRhythmGrid />
                    <UndoRedo />
                    <TapInput document={this.props.document}/>
                    <button onClick={this.props.onNext}>Next</button>
                </div>
            );
        } else if (mode === MODES.PITCH) {
            return (
                <div className="editor">
                    <PitchSelector />
                    <EditableRhythmGrid />
                    <button onClick={this.props.onPrev}>Prev</button>
                </div>
            );
        }
    }
});

let mapStateToProps = (state) => {
    return {
        mode: state.mode
    };
};

let mapDispatchToProps = (dispatch) => {
    return {
        onNext: () => {
           dispatch(setMode(MODES.PITCH));
        },
        onPrev: () => {
           dispatch(setMode(MODES.RHYTHM));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor);
