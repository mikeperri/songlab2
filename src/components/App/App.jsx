import React from 'react';
import EditableNoteGrid from '../../containers/EditableNoteGrid';
import UndoRedo from '../../containers/UndoRedo';
import TapInput from '../../containers/TapInput';

export default React.createClass({
    render: function () {
        return (
            <div>
                <EditableNoteGrid />
                <UndoRedo />
                <TapInput document={document}/>
            </div>
        );
    }
});
