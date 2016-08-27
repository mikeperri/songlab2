import _ from 'lodash';

const defaultSong = {
    key: 'C',
    sections: [
    {
        measures: []
    }
    ]
};

const songReducer = (state = defaultSong, action) => {
    switch (action.type) {
        case 'ADD_CHORD':
            let newSong = _.cloneDeep(state);
            let lastSection = _.last(newSong.sections);

            if (lastSection) {
                lastSection.measures.push({
                    chord: action.chord,
                    tracks: []
                });

                return newSong;
            } else {
                return state;
            }
        default:
            return state;
    }
}

export default songReducer;
