import React from 'react';
import { connect } from 'react-redux';
import SongView from '../../components/SongView/';
import { addChord } from '../../actions/';
import getChordForDegree from '../../utils/getChordForDegree.js';

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

const digitRegex = /^[1-7]$/;

const EditableSong = React.createClass({
    handleKeyDown: function (e) {
        if (digitRegex.test(e.key)) {
            let degree = Number.parseInt(e.key);
            let chord = getChordForDegree(this.props.song.key, degree);

            this.props.onAddChord(chord);
        }
    },
    componentDidMount: function () {
        this.props.document.addEventListener('keydown', this.handleKeyDown);
    },
    componentWillUnmount: function () {
        this.props.document.removeEventListener('keydown', this.handleKeyDown);
    },
    render: function () {
        return <SongView song={this.props.song} />
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditableSong);
