import React from 'react';
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
    let songState = state.editableSong.song;

    return {
        canUndo: songState.past.length > 0,
        canRedo: songState.future.length > 0
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUndo: () => {
            dispatch({ type: 'UNDO' });
        },
        onRedo: () => {
            dispatch({ type: 'REDO' });
        }
    };
};

UndoRedo = connect(
    mapStateToProps,
    mapDispatchToProps
)(UndoRedo);

export default UndoRedo;
