import React from 'react';

export default React.PropTypes.shape({
    beats: React.PropTypes.arrayOf(React.PropTypes.shape({
        tuplet: React.PropTypes.number,
        notes: React.PropTypes.arrayOf(React.PropTypes.shape({
            division: React.PropTypes.object,
            pitch: React.PropTypes.number,
            chord: React.PropTypes.string
        }))
    }))
});
