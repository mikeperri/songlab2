import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SongView from '../../components/SongView/';
import { addChord } from '../../actions/';
import keyboardEventToDegree from '../../utils/keyboardEventToDegree.js';
import getChordForDegree, { CHORD_MODIFIERS } from '../../utils/getChordForDegree.js';

const mapStateToProps = (state) => {
    return {
        song: state.song
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddChord: (chord) => {
            dispatch(addChord(chord));
        }
    };
};

let upKeyActive = false;
let downKeyActive = false;

const EditableSong = React.createClass({
    handleKeyDown: function (e) {
        if (e.key === 'ArrowUp' || e.keyCode === 38) {
            upKeyActive = true;
            e.preventDefault();
            return;
        } else if (e.key === 'ArrowDown' || e.keyCode === 40) {
            downKeyActive = true;
            e.preventDefault();
            return;
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
        if (e.key === 'ArrowUp' || e.keyCode === 38) {
            upKeyActive = false;
        } else if (e.key === 'ArrowDown' || e.keyCode === 40) {
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
