import React from 'react';
import Editor from '../../containers/Editor/';
import SectionView from '../SectionView/';

export default React.createClass({
    propTypes: {
        lowerPitchLimit: React.PropTypes.number,
        upperPitchLimit: React.PropTypes.number,
        song: React.PropTypes.shape({
            sections: SectionView.propTypes.sections
        })
    },
    render: function () {
        let song = this.props.song;
        let lowerPitchLimit = this.props.lowerPitchLimit;
        let upperPitchLimit = this.props.upperPitchLimit;

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
