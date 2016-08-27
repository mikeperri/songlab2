import React from 'react';
import Editor from '../../containers/Editor/';
import SectionView from '../SectionView/';

export default React.createClass({
    propTypes: {
        song: React.PropTypes.shape({
            sections: SectionView.propTypes.sections
        })
    },
    render: function () {
        let song = this.props.song;
        let lowerPitchLimit = 21;
        let upperPitchLimit = 33;

        let sectionElements = song.sections.map((section, index) => {
            return <SectionView
                        section={section}
                        key={index}
                        lowerPitchLimit={lowerPitchLimit}
                        upperPitchLimit={upperPitchLimit} />
        });

        return (
            <div className="song">
                {sectionElements}
            </div>
        );
    }
});
