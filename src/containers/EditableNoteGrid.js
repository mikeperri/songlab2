import { connect } from 'react-redux';
import { setBeats } from '../actions';
import NoteGrid from '../components/NoteGrid';

const mapStateToProps = (state) => {
    return {
        measures: 2,
        beatsPerMeasure: 4,
        beatDivisions: 4,
        pxPerBeat: 100,
        beats: state.beats.present
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onNoteMove: (beats) => {
            dispatch(setBeats(beats));
        }
    };
};

const EditableNoteGrid = connect(
    mapStateToProps,
    mapDispatchToProps
)(NoteGrid);

export default EditableNoteGrid;
