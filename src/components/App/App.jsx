import React from 'react';
import Editor from '../../containers/Editor/';

export default React.createClass({
    render: function () {
        return (
            <div>
                <Editor document={document} />
            </div>
        );
    }
});
