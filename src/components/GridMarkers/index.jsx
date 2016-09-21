import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';
import { trackPropType } from '../../types/track.js';
import { MAX_RESOLUTION } from '../../constants.js';
import getTransformStyle from '../../utils/getTransformStyle.js';

export default React.createClass({
    mixins: [ PureRenderMixin ],
    render: function () {
        let markerElements = this.props.beats.map((beat, beatIndex) => {
            let transformStyle = getTransformStyle(beatIndex, [0, 1], this.props.beatWidth);
            let markerStyle = { transform: transformStyle };

            return <div className="marker" style={markerStyle} key={beatIndex}></div>;
        });

        return <div className="grid-markers">{markerElements}</div>;
    }
});
