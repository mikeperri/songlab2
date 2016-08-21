import React from 'react';
import { setRecording } from '../actions';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import { connect } from 'react-redux';

let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
    <p>
        <button onClick={onUndo} disabled={!canUndo}>
            Undo
        </button>
        <button onClick={onRedo} disabled={!canRedo}>
            Redo
        </button>
    </p>
);

const mapStateToProps = (state) => {
    return {
        canUndo: state.beats.past.length > 0,
        canRedo: state.beats.future.length > 0
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUndo: () => {
            dispatch(setRecording(false));
            dispatch(UndoActionCreators.undo());
        },
        onRedo: () => {
            dispatch(setRecording(false));
            dispatch(UndoActionCreators.redo());
        }
    };
};

UndoRedo = connect(
    mapStateToProps,
    mapDispatchToProps
)(UndoRedo);

export default UndoRedo;
