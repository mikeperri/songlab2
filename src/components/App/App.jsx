import React from 'react';
import Editor from '../../containers/Editor/';
import SongView from '../SongView/';

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
                <SongView song={testSong}
                    lowerPitchLimit={lowerPitchLimit}
                    upperPitchLimit={upperPitchLimit}/>
            </div>
        );
    }
});
