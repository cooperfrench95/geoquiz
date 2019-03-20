import * as React from 'react';
import * as Types from '../shared/types';
import { baseURL } from '../shared/baseURL';
import { Loading } from './LoadingComponent';

export const ClueViewer = (props: Types.ClueViewerProps) => {

    console.log(props.CurrentRoundState.clues);

    // State
    const [currentPhoto, changeCurrentPhoto] = React.useState(0);
    const [downcaretOpacity, changeOpacity] = React.useState(1);

    // Lifecycle 
    React.useEffect(() => {
        changeCurrentPhoto(props.CurrentRoundState.clues.Photos.length - 1);
        var container: any = document.getElementById("cluesDiv1")
        container.scrollTop = 0;
    }, [props.CurrentRoundState.current_round, props.CurrentRoundState.clues.Photos])

    // Functions
    const handleScroll = () => {
        changeOpacity(0);
    }


    const changePhoto = (direction: 'back' | 'forward') => {
        switch (direction) {
            case 'back':
                if (currentPhoto === 0) {
                    changeCurrentPhoto(props.CurrentRoundState.clues.Photos.length - 1);
                }
                else {
                    changeCurrentPhoto(currentPhoto - 1);
                }
            case 'forward':
                if (currentPhoto >= props.CurrentRoundState.clues.Photos.length - 1) {
                    changeCurrentPhoto(0);
                }
                else {
                    changeCurrentPhoto(currentPhoto + 1);
                }
        }
    }

    const getPhotoClueButton = () => {
        if (props.CurrentRoundState.clues.Photos.length < 5 && props.CurrentRoundState.cluesRemaining > 0) {
            return(
                <div className="getClueButtonDiv">
                    <span 
                    onClick={() => {
                        props.getNextClue('Photo', props.CurrentRoundState.token, props.CurrentRoundState.clues.Photos);
                        changeCurrentPhoto(props.CurrentRoundState.clues.Photos.length - 1);
                    }} 
                    className="getClueButtonInner"
                    >
                        Get more photos
                    </span>
                </div>
            );
        }
        else {
            return(
                <div className="getClueButtonDiv">
                    <span
                    className="getClueButtonInnerGrey"
                    >
                        Get more photos
                    </span>
                </div>
            );
        }
    };

    const getRegularClueButton = (type: string) => {
        if (props.CurrentRoundState.cluesRemaining > 0) {
            return (
                <div className="getClueButtonDiv">
                    <span 
                    onClick={() => props.getNextClue(type, props.CurrentRoundState.token)} 
                    className="getClueButtonInner"
                    >
                        Get clue
                    </span>
                </div>
            );
        }
        else {
            return (
                <div className="getClueButtonDiv">
                    <span
                    className="getClueButtonInnerGrey"
                    >
                        Get clue
                    </span>
                </div>
            );
        }
    };

    // Create clues
    const photoClue =   <div className="ClueDisplayDiv">
                            <span className="clueTitle">Images ({props.CurrentRoundState.clues.Photos.length})</span>
                            <div className="imagesCluesInnerDiv">
                                <div onClick={() => changePhoto('back')} className="previousPhotoButton">
                                    <span className="fa fa-caret-left"></span>
                                </div>
                                <img className="imageClueImage" src={baseURL + props.CurrentRoundState.clues.Photos[currentPhoto]} alt={props.CurrentRoundState.clues.Photos[currentPhoto]}/>
                                <div  onClick={() => changePhoto('forward')} className="nextPhotoButton">
                                    <span className="fa fa-caret-right"></span>
                                </div>
                            </div>
                            {getPhotoClueButton()}
                        </div>;

    const flagClue = props.CurrentRoundState.clues.hasOwnProperty('flag') 
    ?   <div className="ClueDisplayDiv">
            <span className="clueTitle">Flag</span>
            <img className="imageClueImage" src={baseURL + props.CurrentRoundState.clues.flag} alt={props.CurrentRoundState.clues.flag} />
        </div>
    :   <div className="ClueDisplayDiv">
            <span className="clueTitle">Flag</span>
            {getRegularClueButton('flag')}
        </div>;

    // Change this if adding further game modes
    const otherCluesArray = ['education_spending', 'gdp_per_capita', 'gdp_growth_rate', 
    'life_expectancy', 'area', 'value_of_exports', 'religion', 'region', 
    'population', 'currency', 'average_temp', 'capital', 'hdi',
    'languages', 'military_spending'];

    const otherClues = otherCluesArray.map((field, index) => {
        if (props.CurrentRoundState.clues.hasOwnProperty(field)) {
            return(
                <div key={index} className="ClueDisplayDiv">
                    <span className="clueTitle">{field}</span>
                    <span className="clueValue">{props.CurrentRoundState.clues[field]}</span>
                </div>
            );
        }
        else {
            return(
                <div key={index} className="ClueDisplayDiv">
                    <span className="clueTitle">{field.replace(/_/g, ' ')}</span>
                    {getRegularClueButton(field)}
                </div>
            );
        }
    });

    // Render
    if (props.CurrentRoundState.clueLoading) {
        return <div className="LoadingDivForClues">
                    <Loading 
                        style={{
                            position: "relative" as "relative", 
                            top: "40%"
                        }} 
                        size="40px" 
                        margin="5px" 
                    />
                </div>;
    }
    else {
        return  <div onScroll={handleScroll} id="cluesDiv1" className="cluesDivInner">
                    {photoClue}
                    {flagClue}
                    {otherClues}
                    <div style={{ opacity: downcaretOpacity }} className="clueDivDownCaret">
                        <span className="fa fa-caret-down animated flash repeatAnimation"><span className="permanentMarker"> Scroll for more clues</span></span>    
                    </div> 
                </div>
    }
};