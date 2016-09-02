import { connect } from 'react-redux';
import { setBeats } from '../actions';
import RhythmGridView from '../components/RhythmGridView';

const mapStateToProps = (state) => {
    return {
        numberOfMeasures: 2,
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

const EditableRhythmGrid = connect(
    mapStateToProps,
    mapDispatchToProps
)(RhythmGridView);

export default EditableRhythmGrid;
