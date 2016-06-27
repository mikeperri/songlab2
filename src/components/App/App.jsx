import React from 'react';
import TapInput from '../TapInput';

export default React.createClass({
    render: function () {
        return (
            <div>
                <TapInput document={document}/>
            </div>
        );
    }
});
