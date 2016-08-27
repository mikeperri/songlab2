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
                    tuplet: 1,
                    notes: [
                    {
                        division: 0,
                        pitch: 'C'
                    }
                    ]
                }
                ]
            }
            ]
        }
        ]
    }
    ]
};

export default React.createClass({
    render: function () {
        return (
            <div>
                <SongView song={testSong} />
            </div>
        );
    }
});
