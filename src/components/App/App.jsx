import React from 'react';
import EditableNoteGrid from '../../containers/EditableNoteGrid';
import TapInput from '../TapInput';

export default React.createClass({
    render: function () {
        return (
            <div>
                <EditableNoteGrid />
                <TapInput document={document}/>
            </div>
        );
    }
});
