import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SongView from '../../components/SongView/';
import keyboardEventToDegree from '../../utils/keyboardEventToDegree.js';
import getChordForDegree, { CHORD_MODIFIERS } from '../../utils/getChordForDegree.js';
import {
    addChord,
    selectionLeft,
    selectionRight,
    selectionUp,
    selectionDown,
    deleteMeasure,
    deleteChord
} from '../../actions/';

const mapStateToProps = (state) => {
    return {
        song: state.song
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddChord: (chord) => {
            dispatch(addChord(chord));
        },
        onSelectionLeft: () => {
            dispatch(selectionLeft());
        },
        onSelectionRight: () => {
            dispatch(selectionRight());
        },
        onSelectionUp: () => {
            dispatch(selectionUp());
        },
        onSelectionDown: () => {
            dispatch(selectionDown());
        },
        onDeleteMeasure: (measureIndex) => {
            dispatch(deleteMeasure(measureIndex));
        },
        onDeleteChord: (measureIndex, beatIndex) => {
            dispatch(deleteChord(measureIndex, beatIndex));
        }
    };
};

let upKeyActive = false;
let downKeyActive = false;

const EditableSong = React.createClass({
    handleKeyDown: function (e) {
        if (e.key.toLowerCase() === 's') {
            upKeyActive = true;
            e.preventDefault();
            return;
        } else if (e.key.toLowerCase() === 'b') {
            downKeyActive = true;
            e.preventDefault();
            return;
        } else if (e.key === 'h' || e.key === 'ArrowLeft') {
            this.props.onSelectionLeft();
        } else if (e.key === 'l' || e.key === 'ArrowRight') {
            this.props.onSelectionRight();
        } else if (e.key === 'j' || e.key === 'ArrowDown') {
            this.props.onSelectionDown();
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
            this.props.onSelectionUp();
        } else if (e.key === 'x') {
            let measureIndex = this.props.song.selectedMeasureIndex;
            let beatIndex = this.props.song.selectedBeatIndex;

            if (beatIndex !== null) {
                this.props.onDeleteChord(measureIndex, beatIndex);
            } else {
                this.props.onDeleteMeasure(measureIndex);
            }
        }

        let degree = keyboardEventToDegree(e);

        if (degree) {
            let chordModifiers = [];
            if (e.shiftKey) {
                chordModifiers.push(CHORD_MODIFIERS.SWITCH_MAJOR_MINOR);
            }
            if (upKeyActive) {
                chordModifiers.push(CHORD_MODIFIERS.SHARP);
            } else if (downKeyActive) {
                chordModifiers.push(CHORD_MODIFIERS.FLAT);
            }

            let chord = getChordForDegree(this.props.song.key, degree, chordModifiers);

            this.props.onAddChord(chord);
        }
    },
    handleKeyUp: function (e) {
        if (e.key.toLowerCase() === 's' || e.keyCode === 38) {
            upKeyActive = false;
        } else if (e.key.toLowerCase() === 'b' || e.keyCode === 40) {
            downKeyActive = false;
        }
    },
    componentDidMount: function () {
        this.props.document.addEventListener('keydown', this.handleKeyDown);
        this.props.document.addEventListener('keyup', this.handleKeyUp);
    },
    componentWillUnmount: function () {
        this.props.document.removeEventListener('keydown', this.handleKeyDown);
        this.props.document.removeEventListener('keyup', this.handleKeyUp);
    },
    render: function () {
        return <SongView song={this.props.song} />
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditableSong);
