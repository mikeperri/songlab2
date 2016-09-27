import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// Components
import TapInput from '../../components/TapInput/';
import PitchInput from '../../components/PitchInput/';
import SongView from '../../components/SongView/';
import InputModeView from '../../components/InputModeView/';

// Containers
import UndoRedo from '../UndoRedo.jsx';

import keyboardEventToDegree from '../../utils/keyboardEventToDegree.js';
import getChordForDegree, { CHORD_MODIFIERS } from '../../utils/getChordForDegree.js';
import { INPUT_MODES } from '../../constants.js';
import {
    insertMeasure,
    setBeat,
    setNote,
    setPitch,
    addChord,
    selectionLeft,
    selectionRight,
    selectionUp,
    selectionDown,
    selectionToStart,
    setSelectionResolution,
    setSelectionTuplet,
    selectNextNote,
    selectPrevNote,
    deleteMeasure,
    deleteNote,
    setInputMode
} from '../../actions/';

const mapStateToProps = (state) => {
    return {
        song: state.song.present
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onInsertMeasure: (measureIndex) => {
            dispatch(insertMeasure(measureIndex));
        },
        onSetBeat: (beat, tuplet) => {
            dispatch(setBeat(beat, tuplet));
        },
        onSetNote: (noteParams) => {
            dispatch(setNote(noteParams));
        },
        onSetPitch: (pitch) => {
            dispatch(setPitch(pitch));
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
        onSelectionToStart: () => {
            dispatch(selectionToStart());
        },
        onSetSelectionResolution: (resolution) => {
            dispatch(setSelectionResolution(resolution));
        },
        onSetSelectionTuplet: (tuplet) => {
            dispatch(setSelectionTuplet(tuplet));
        },
        onSelectNextNote: () => {
            dispatch(selectNextNote());
        },
        onSelectPrevNote: () => {
            dispatch(selectPrevNote());
        },
        onDeleteMeasure: (measureIndex) => {
            dispatch(deleteMeasure(measureIndex));
        },
        onDeleteNote: (measureIndex, beatIndex) => {
            dispatch(deleteNote(measureIndex, beatIndex));
        },
        onSetMode: (mode) => {
            dispatch(setInputMode(mode));
        }
    };
};

let upKeyActive = false;
let downKeyActive = false;

const EditableSong = React.createClass({
    handleKeyDown: function (e) {
        if (e.key === 'Escape') {
            this.props.onSetMode(INPUT_MODES.NORMAL);
        } else if (this.props.song.inputMode !== INPUT_MODES.NORMAL) {
            return;
        }

        if (e.key.toLowerCase() === 's') {
            upKeyActive = true;
        } else if (e.key.toLowerCase() === 'b') {
            downKeyActive = true;
        } else if (e.key === 'h' || e.key === 'ArrowLeft') {
            this.props.onSelectionLeft();
        } else if (e.key === 'l' || e.key === 'ArrowRight') {
            this.props.onSelectionRight();
        } else if (e.key === 'j' || e.key === 'ArrowDown') {
            this.props.onSelectionDown();
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
            this.props.onSelectionUp();
        } else if (e.key === '0') {
            this.props.onSelectionToStart();
        } else if (e.key === 'i') {
            let measureIndex = this.props.song.selectedMeasureIndex;

            this.props.onInsertMeasure(measureIndex);
        } else if (e.key === 'x') {
            let measureIndex = this.props.song.selectedMeasureIndex;
            let beatIndex = this.props.song.selectedBeatIndex;

            if (beatIndex !== null) {
                this.props.onDeleteNote(measureIndex, beatIndex);
            } else {
                this.props.onDeleteMeasure(measureIndex);
            }
        } else if (e.key === 'r') {
            this.props.onSetMode(INPUT_MODES.RHYTHM);
        } else if (e.key === 'p') {
            this.props.onSetMode(INPUT_MODES.PITCH);
        } else if (e.key === '-' || e.key === '_') {
            this.props.onSetSelectionResolution(this.props.song.selectionResolution + 1);
        } else if (e.key === '=' || e.key === '+') {
            this.props.onSetSelectionResolution(this.props.song.selectionResolution - 1);
        } else if (e.key === 't') {
            let tuplet = this.props.song.selectionTuplet;
            let nextTuplet = tuplet === 3 ? 1 : 3;
            this.props.onSetSelectionTuplet(nextTuplet);
        } else if (e.key === 'w') {
            this.props.onSelectNextNote();
        } else if (e.key === 'b') {
            this.props.onSelectPrevNote();
        } else {
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

                this.props.onSetNote({ chord });
            }
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
        let input;
        let song = this.props.song;

        if (song.inputMode === INPUT_MODES.RHYTHM) {
            input = (<TapInput
                document={this.props.document}
                onSetBeat={this.props.onSetBeat}
                />);
        } else if (song.inputMode === INPUT_MODES.PITCH) {
            input = (<PitchInput
                document={this.props.document}
                keySignature={song.key}
                onSetNote={this.props.onSetNote}
                />);
        }

        return (
            <div>
                <InputModeView inputMode={song.inputMode} />
                <UndoRedo />
                {input}
                <SongView
                    keySignature={song.key}
                    measures={song.measures}
                    selectedMeasureIndex={song.selectedMeasureIndex}
                    selectedTrackIndex={song.selectedTrackIndex}
                    selectedBeatIndex={song.selectedBeatIndex}
                    selectedDivision={song.selectedDivision}
                    selectionResolution={song.selectionResolution}
                    selectionTuplet={song.selectionTuplet}
                    />
            </div>
        );
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditableSong);
