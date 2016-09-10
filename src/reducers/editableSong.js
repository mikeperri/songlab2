import _ from 'lodash';
import songReducer from './song.js';
import noteEditorReducer from './noteEditor.js';
import Track from '../constructors/track.js';

export default (state, action) => {
    return {
        song: songReducer(_.get(state, 'song'), action),
        noteEditor: noteEditorReducer(_.get(state, 'noteEditor'), action)
    };
}
