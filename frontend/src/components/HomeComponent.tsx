import * as React from 'react';
import * as Types from '../shared/types';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
 
export const Home = (props: Types.HomeProps) => {

    const [trueIsHomeFalseIsAbout, toggleHomeAbout] = React.useState(true); 
    const [selectedDifficulty, changeSelectedDifficulty] = React.useState('');
    const [selectedGameMode, changeSelectedGameMode] = React.useState('');
    const playButton = props.NewGameLink.link === undefined ? <span className="playButtonGrey"><span className="fa fa-play"></span> Play</span>
                                                            : <Link to={props.NewGameLink.link.slice(props.NewGameLink.link.indexOf('play/'))} className="playButton"><span className="fa fa-play"></span> Play</Link>;

    const switchView = (tab: string) => {
        if (tab === 'home') {
            toggleHomeAbout(true);
        }
        else if (tab === 'about') {
            toggleHomeAbout(false);
        }
    }

    if (props.NewGameLink.link !== undefined) {
        var gameURL = <span style={{fontFamily: "'Permanent Marker', sans-serif", overflowWrap: "break-word"}}>{props.NewGameLink.link}</span>;
    }
    else if (props.NewGameLink.loading === true) {
        gameURL = <Loading style={{position: "relative" as "relative"}} size={"40px"} margin={"0px"} />;
    }
    else if (props.NewGameLink.error !== undefined) {
        gameURL = <span className="selectOptions" onClick={() => props.fetchLink(selectedDifficulty, selectedGameMode)}>Error creating game. Click to try again <span style={{cursor: "pointer"}} className="fa fa-refresh"></span></span>
    }
    else {
        gameURL = <span style={{fontFamily: "'Permanent Marker', sans-serif"}}>Select difficulty and game mode to generate link</span>
    }

    const setDifficulty = async (difficulty: 'Easy' | 'Medium' | 'Hard') => {
        changeSelectedDifficulty(difficulty);
        if (selectedGameMode !== '') {
            props.fetchLink(difficulty, selectedGameMode);
        }
    }

    const setGameMode = async (gameMode: 'World') => {
        changeSelectedGameMode(gameMode);
        if (selectedDifficulty !== '') {
            props.fetchLink(selectedDifficulty, gameMode);
        }
    }
    

    if (trueIsHomeFalseIsAbout === false) {
        return(
            <React.Fragment>
                <div className="homePageOuterDiv">
                </div>
                <div className="homePageFlexContainer animated fadeIn">
                    <div className="homePageHeaderLinksDiv animated fadeIn">
                        <a className="animated fadeIn homePageHeaderButtons" onClick={() => switchView('home')}>Home</a>
                        <span className="fa fa-globe"></span>
                        <a className="animated fadeIn homePageHeaderButtons" onClick={() => switchView('about')}>About</a>
                    </div>
                    <div className="homePageMainDiv">
                        <h1 className="homepageBanner">GeoQuiz</h1>
                    </div>
                    <div className="emboss optionsSelectDiv">
                        <p className="aboutPageText">GeoQuiz is a web-based game heavily inspired by <a href="http://geoguessr.com/">GeoGuessr.com</a> (go check them out, that site is great fun). It is designed to test your geography knowledge.</p>
                        <p className="aboutPageText">During each of the 5 rounds of play, you will need to guess the country or territory by finding it on the map. Various clues will be available to help you on your way. The less clues you ask for, the higher your score will be for that round - but if your guess is wrong, your score will be 0!</p>
                        <p className="aboutPageText">Some of the clues are worth more than others and this will be reflected in your score. For instance, a country's capital is a better clue than its human development index, so if you ask to see a country's capital, you'll end up with a lower score than you might have if you had asked for its HDI and still guessed correctly.</p>
                        <p className="aboutPageText">Photos are sourced from the Flickr API. They should be SFW but may not always be 100% useful as clues. Flickr users really love taking pictures of birds.</p>
                        <p className="aboutPageText">This project was built using ReactJS, Typescript, Flask, and SQL.</p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
    else {
        return(
            <React.Fragment>
                <div className="homePageOuterDiv">
                </div>
                <div className="homePageFlexContainer animated fadeIn">
                    <div className="homePageHeaderLinksDiv animated fadeIn">
                        <a className="animated fadeIn homePageHeaderButtons" onClick={() => switchView('home')}>Home</a>
                        <span className="fa fa-globe"></span>
                        <a className="animated fadeIn homePageHeaderButtons" onClick={() => switchView('about')}>About</a>
                    </div>
                    <div className="homePageMainDiv">
                        <h1 className="homepageBanner">GeoQuiz</h1>
                    </div>
                    <div className="emboss optionsSelectDiv">
                        <div className="homepageGameOptionsDiv">
                            <h2 className="selectOptionsTitles">Select Difficulty</h2>
                            <div style={{flexGrow: 1, display: "flex", justifyContent: "space-evenly"}}>
                                <span style={selectedDifficulty === 'Easy' ? {background: "#4C8ED9"} : {}} onClick={() => setDifficulty('Easy')} className="selectOptions">Easy</span>
                                <span style={selectedDifficulty === 'Medium' ? {background: "#4C8ED9"} : {}} onClick={() => setDifficulty('Medium')} className="selectOptions">Medium</span>
                                <span style={selectedDifficulty === 'Hard' ? {background: "#4C8ED9"} : {}} onClick={() => setDifficulty('Hard')} className="selectOptions">Hard</span>
                            </div>
                        </div>
                        <div className="homepageGameOptionsDiv">
                            <h2 className="selectOptionsTitles">Select Game Mode</h2>
                            <div style={{flexGrow: 1, display: "flex", justifyContent: "space-evenly", flexBasis: "235px"}}>
                                <span style={selectedGameMode === 'World' ? {background: "#4C8ED9"} : {}} onClick={() => setGameMode('World')} className="selectOptions">World</span>
                            </div>
                        </div>
                        <div className="homepageGameOptionsDiv">
                            <h2 className="selectOptionsTitles">Unique Game URL</h2>
                            <div style={{overflow: "hidden", flexGrow: 1, textAlign: "center"}}>
                                {gameURL}
                            </div>
                        </div>
                        {playButton}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}