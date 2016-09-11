import React from 'react';
import { INPUT_MODES } from '../../constants.js';

export default React.createClass({
    render: function () {
        let inputMode = this.props.inputMode;
        let normalClassName = inputMode === INPUT_MODES.NORMAL ? 'selected' : '';
        let rhythmClassName = inputMode === INPUT_MODES.RHYTHM ? 'selected' : '';
        let pitchClassName = inputMode === INPUT_MODES.PITCH ? 'selected' : '';

        return (
            <div className="input-mode-view">
                <div className={normalClassName}>NORMAL</div>
                <div className={rhythmClassName}>RHYTHM</div>
                <div className={pitchClassName}>PITCH</div>
            </div>
        );
    }
});
