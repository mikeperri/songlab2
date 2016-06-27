import React from 'react';
import SVGS from './SpriteIdNameMap';

// Based on example in https://github.com/kisenka/svg-sprite-loader/blob/v0.1.0/README.md

export default React.createClass({
    componentDidMount: function () {
        if (this.props.color) {
            this.refs.svg.getElementsBy
        }
    },
    render: function () {
        let spriteId = this.props.spriteId;
        let width = this.props.width || '30px';
        let height = this.props.height || '30px';

        return (
            <svg ref="svg" width={this.props.width} height={this.props.height} dangerouslySetInnerHTML={{__html: '<use xlink:href="' + spriteId + '"></use>'}} />
        );
    }
});
