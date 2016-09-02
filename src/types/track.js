import React from 'react';

let trackPropType = React.PropTypes.shape({
    beats: React.PropTypes.arrayOf(React.PropTypes.shape({
        tuplet: React.PropTypes.number,
        notes: React.PropTypes.arrayOf(React.PropTypes.shape({
            division: React.PropTypes.number,
            pitch: React.PropTypes.number,
            chord: React.PropTypes.string
        }))
    }))
});

export { trackPropType };
