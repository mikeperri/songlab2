import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import TapInput from '../TapInput/';
import UndoRedo from '../UndoRedo.jsx';
import SongView from '../../components/SongView/';
import InputModeView from '../../components/InputModeView/';
import keyboardEventToDegree from '../../utils/keyboardEventToDegree.js';
import getChordForDegree, { CHORD_MODIFIERS } from '../../utils/getChordForDegree.js';
import { INPUT_MODES } from '../../constants.js';
import {
    insertMeasure,
    addChord,
    selectionLeft,
    selectionRight,
    selectionUp,
    selectionDown,
    deleteMeasure,
    deleteChord,
    setInputMode
} from '../../actions/';

const mapStateToProps = (state) => {
    return {
        song: state.editableSong.song,
        recording: state.editableSong.noteEditor.recording
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onInsertMeasure: (measureIndex) => {
            dispatch(insertMeasure(measureIndex));
        },
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
        },
        onStartRecording: () => {
            dispatch(setInputMode(INPUT_MODES.RHYTHM));
        },
        onStopRecording: () => {
            dispatch(setInputMode(INPUT_MODES.NORMAL));
        }
    };
};

let upKeyActive = false;
let downKeyActive = false;

const EditableSong = React.createClass({
    getSong: function () {
        return this.props.song.present;
    },
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
        } else if (e.key === 'i') {
            let measureIndex = this.getSong().selectedMeasureIndex;

            this.props.onInsertMeasure(measureIndex);
        } else if (e.key === 'x') {
            let measureIndex = this.getSong().selectedMeasureIndex;
            let beatIndex = this.getSong().selectedBeatIndex;

            if (beatIndex !== null) {
                this.props.onDeleteChord(measureIndex, beatIndex);
            } else {
                this.props.onDeleteMeasure(measureIndex);
            }
        } else if (e.key === 'r') {
            if (this.props.recording) {
                this.props.onStopRecording();
            } else {
                this.props.onStartRecording();
            }
        } else if (e.key === 'Escape') {
            this.props.onStopRecording();
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

            let chord = getChordForDegree(this.getSong().key, degree, chordModifiers);

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
        let tapInput;
        let song = this.getSong();

        if (song.inputMode === INPUT_MODES.RHYTHM) {
            tapInput = <TapInput document={this.props.document} />;
        }

        return (
            <div>
                <InputModeView inputMode={song.inputMode} />
                <UndoRedo />
                {tapInput}
                <SongView
                    keySignature={song.key}
                    measures={song.measures}
                    selectedMeasureIndex={song.selectedMeasureIndex}
                    selectedBeatIndex={song.selectedBeatIndex}
                    />
            </div>
        );
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditableSong);
