import React from 'react';
import EditableSong from '../../containers/EditableSong/';

let testSong = {
    sections: [
    {
        measures: [
        {
            chord: 'C',
            tracks: [
            {
                beats: [
                {
                    tuplet: 4,
                    notes: [
                    {
                        division: 0,
                        pitch: 21
                    },
                    {
                        division: 1,
                        pitch: 23
                    },
                    {
                        division: 3,
                        pitch: 25
                    }
                    ]
                }
                ]
            }
            ]
        },
        {
            chord: 'G',
            tracks: [
            ]
        }
        ]
    }
    ]
};

export default React.createClass({
    render: function () {
        let lowerPitchLimit = 21;
        let upperPitchLimit = 35;

        return (
            <div>
                <EditableSong document={document} />
            </div>
        );
    }
});
