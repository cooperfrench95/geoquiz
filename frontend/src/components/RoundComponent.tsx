import * as React from 'react';
import * as Types from '../shared/types';
import ZoomableGroupCustom from './ZoomableGroupCustomComponent';
import { ComposableMap, Geographies, Geography, Marker, Markers } from 'react-simple-maps';
import { ClueViewer } from './ClueViewerComponent';
import { Loading } from './LoadingComponent';
import { Answer } from './AnswerComponent';

const styles = { 
    default: {
        fill: "#15FDFF",
        stroke: "black",
        strokeWidth: "0.5",
        outline: "none"
    },
    hover: {
        fill: "orange",
        stroke: "black",
        strokeWidth: "2",
        outline: "none",
        cursor: "pointer"
    },
    pressed: {
        fill: "orange",
        stroke: "black",
        strokeWidth: "0.5",
        outline: "none"
    }
};

const selectedStyles = {
    default: {
        fill: "orange",
        stroke: "black",
        strokeWidth: "2",
        outline: "none"
    },
    hover: {
        fill: "orange",
        stroke: "black",
        strokeWidth: "2",
        outline: "none"
    },
    pressed: {
        fill: "orange",
        stroke: "black",
        strokeWidth: "2",
        outline: "none"
    }
}

export const Round = (props: Types.RoundProps) => {

    if (props.CurrentRoundState.token === "") {
        props.history.push('/home');
    }

    // State
    const [countryName, changeCountryName] = React.useState('None');
    const [zoomLevel, changeZoomLevel] = React.useState(1);
    const [cluesAreOpen, toggleClues] = React.useState(false);
    const [touchError, toggleTouchesError] = React.useState(false);
    const [touchErrorSeen, setTouchErrorSeen] = React.useState(false);
    const [showAnswerComponent, toggleAnswerComponent] = React.useState(false);
    const [disableOptimizations, toggleOptimisations] = React.useState(false);
    const [repeatAnimation, toggleRepeatAnimation] = React.useState("repeatAnimation attentionBackgroundColour");
    const [showInstructions, toggleShowInstructions] = React.useState(true);

    // Functions
    const handleClick = async (geography: any) => {
        await toggleOptimisations(true);
        await changeCountryName(geography.properties.NAME);
        await toggleOptimisations(false);
    };

    const handleZoom = (change: number) => {
        change = change < 0 ? 1 : -1;
        if (zoomLevel + change < 1) {
            return
        }
        else {
            if (change > 0) {
                changeZoomLevel(zoomLevel * 2);
            }
            else {
                changeZoomLevel(zoomLevel / 2);
            }
        }
    };

    const handleGuess = async () => {
        await props.makeGuess(countryName, props.CurrentRoundState.token);
        await toggleAnswerComponent(true);
        await toggleClues(false);
        await changeCountryName('None');
        await toggleRepeatAnimation("repeatAnimation attentionBackgroundColour")
    };

    const handleSingleTouch = (event: React.TouchEvent) => {
        event.preventDefault();
        if (event.touches.length === 1 && touchError === false && touchErrorSeen === false) {
            toggleTouchesError(true);
            setTouchErrorSeen(true);
        }
    };

    // Components
    const guessButton = () => {
        if (props.SubmitGuessState.guessLoading) {
            return(
                <Loading size={"40px"} margin="5px" style={{position: "relative" as "relative"}} />
            );
        }
        else if (countryName === 'None') {
            return(
                <div className="guessButtonGrey">Make Guess <span className="fa fa-compass"></span></div>
            );
        }
        else {
            return(
                <div onClick={handleGuess} className="guessButton">Make Guess <span className="fa fa-compass"></span></div>
            );
        }
    }

    const displayNothing = <div style={{display: "none", width: 0, height: 0}}></div>;

    const answerDiv = () => {
        if (showAnswerComponent) {
            return(
                <Answer push={props.history.push} displayNothing={displayNothing} SubmitGuessState={props.SubmitGuessState} toggleAnswerComponent={toggleAnswerComponent} />
            );
        }
        else {
            return displayNothing
        };
    };


    const SmallCountryCoordinates = require("../shared/smallCountryCoordinates.json");
    const SmallCountryCoordinateMarkers = SmallCountryCoordinates.map((country: Types.countryCoordinate, index: number) => {
        return(
                <Marker preserveMarkerAspect={true} key={index} onClick={() => {handleClick({properties: { NAME: country.name }})}} marker={{ coordinates: country.coordinates }}>
                    <circle className={countryName === country.name ? "smallCountryDotSelected" : "smallCountryDot"} r={12} />
                </Marker>
            
        );
    });

    const clueToggleCaret = cluesAreOpen ? <span className="fa fa-chevron-circle-up"></span> : <span className="fa fa-chevron-circle-down"></span>;

    const touchWarning = touchError ? <div className="touchWarningDiv">
                                            <span className="touchWarningText permanentMarker">Use two fingers to pan across the map. Use the buttons to zoom</span>
                                            <span onClick={() => toggleTouchesError(false)} className="dismissFingerWarning">OK <span className="fa fa-hand-scissors-o"></span></span>
                                      </div> 
                                    : displayNothing;

    const infoWarning = showInstructions ?  <div className="touchWarningDiv">
                                                <span className="touchWarningText permanentMarker">Guess the country based on the clues</span>
                                                <span onClick={() => toggleShowInstructions(false)} className="dismissFingerWarning">OK <span className="fa fa-hand-scissors-o"></span></span>
                                            </div> 
                                         :  displayNothing;

    const cluesViewer = <div style={cluesAreOpen ? {} :{display: "none"}} className="cluesDiv emboss">
                            <ClueViewer getNextClue={props.getNextClue} CurrentRoundState={props.CurrentRoundState}></ClueViewer>
                        </div> 

    // If an error occurs, notify user
    const errorNotification = () => {
        if (props.CurrentRoundState.clueError !== undefined) {
            return(
            <div className="errorNotifier animated fadeInDown">
                <span><span className="fa fa-warning"></span> Error retrieving your clue</span>
            </div>
            );
        }
        else if (props.SubmitGuessState.guessError !== undefined) {
            return(
            <div className="errorNotifier animated fadeInDown">
                <span><span className="fa fa-warning"></span> Error making your guess</span>
            </div>
            );
        }
        else {
            return displayNothing
        }
    };


    // Render
    return  <React.Fragment>
                {answerDiv()}
                {errorNotification()}
                <div className="mapZoomButtonsDiv">
                    <div onClick={() => handleZoom(-1)} className="mapZoomButton">
                        <span className="fa fa-plus"></span>
                    </div>
                    <div onClick={() => handleZoom(1)} className="mapZoomButton">
                        <span className="fa fa-minus"></span>
                    </div>
                </div>
                <div key={showAnswerComponent.toString()} className={"cluesExpandButton animated heartBeat " + repeatAnimation}>
                    <div className="mapZoomButton permanentMarker" onClick={() => {toggleClues(!cluesAreOpen); toggleRepeatAnimation("")}}>Clues {clueToggleCaret}</div>
                </div>
                {cluesViewer}
                {touchWarning}
                {infoWarning}
                <div className="composableMapContainer" onTouchMove={handleSingleTouch} onWheel={(event) => handleZoom(event.deltaY)}>
                    <ComposableMap
                        projection="times"
                        style={{
                            width: "100vw",
                            height: "100vh",
                            borderBottom: "2px solid black"
                        }}
                        width={1000}
                        height={1000}
                        projectionConfig={{
                            scale: 300,
                            rotation: [-10, 0, 0],
                            precision: 1
                        }}
                    >
                        <ZoomableGroupCustom zoom={zoomLevel} desiredWidth={2000} desiredHeight={2000} x={-500} style={{width: "100vw", cursor: "grab"}}>
                            <Geographies geography={require("../shared/my_topojson_world2.json")} disableOptimization={disableOptimizations}>
                                {(geographies, projection) => geographies.map((geography: any, index) => (
                                <Geography
                                    cacheId={index + 500}
                                    key={ index }
                                    round={true}
                                    geography={ geography }
                                    projection={ projection }
                                    onClick={handleClick}
                                    style={countryName !== geography.properties.NAME ? styles : selectedStyles}
                                    />
                                ))}
                            </Geographies>
                            <Markers>
                                {
                                    SmallCountryCoordinateMarkers
                                }
                            </Markers>
                        </ZoomableGroupCustom>
                    </ComposableMap>
                </div>
                <div className="BottomMapDiv emboss">
                    <div className="bottomMapInfo">
                        <span className="bottomMapInfoType">Round</span>
                        <span className="bottomMapInfoInfo">{props.CurrentRoundState.current_round} / 5</span>
                    </div>
                    <div className="bottomMapInfo">
                        <span className="bottomMapInfoType">Score</span>
                        <span className="bottomMapInfoInfo">{props.CurrentRoundState.current_score}</span>
                    </div>
                    <div className="bottomMapInfo">
                        <span className="bottomMapInfoType">Clues</span>
                        <span key={props.CurrentRoundState.cluesRemaining} className="bottomMapInfoInfo animated jackInTheBox">{props.CurrentRoundState.cluesRemaining} / {props.CurrentRoundState.cluesLimit}</span>
                    </div>
                    <div className="bottomMapInfo">
                        <span className="bottomMapInfoType">Selected Country</span>
                        <span className="bottomMapInfoInfo">{countryName}</span>
                    </div>
                    <div className="bottomMapInfo">
                        {guessButton()}
                    </div>
                </div>
            </React.Fragment>;
};

