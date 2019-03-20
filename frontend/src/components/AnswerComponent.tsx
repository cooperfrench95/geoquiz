import * as React from 'react';
import * as Types from '../shared/types';
import { baseURL } from '../shared/baseURL';


export const Answer = (props: Types.AnswerProps) => {

    // Functions
    const nextRound = () => {
        if (props.SubmitGuessState.hasOwnProperty('final_score')) {
            props.push('/end');
        }
        props.toggleAnswerComponent(false);
    }

    if (props.SubmitGuessState.correct === true) {
        return(
            <div className="answerDiv animated fadeInDown">
                <div className="answerCorrectOrWrong">
                    <span>Correct!</span>
                </div>
                <div className="correctAnswerDetails">
                    <div className="answerCountryCard">
                        <img className="answerFlag" src={baseURL + props.SubmitGuessState.yourGuessValues.flag} alt={'Wrong answer flag'} />
                        <div>
                            <p className="answerCountry">{props.SubmitGuessState.yourGuessValues.country}</p>
                            <p  className="answerCapital">Capital: {props.SubmitGuessState.yourGuessValues.capital}</p>
                        </div>                            
                    </div>
                </div>
                <div className="nextRoundButtonDiv">
                    <span className="nextRoundButton" onClick={nextRound}>Continue</span>
                </div>
            </div>
        );
    }
    else if (props.SubmitGuessState.correct === false) {
        return(
            <div className="answerDiv animated fadeInDown">
                <div className="answerCorrectOrWrong">
                    <span>Wrong!</span>
                </div>
                <div className="wrongAnswerDetails">
                    <h3 className="answerDetailsTitle">Your Guess</h3>
                    <div className="answerCountryCard">
                        <img className="answerFlag" src={baseURL + props.SubmitGuessState.yourGuessValues.flag} alt={'Wrong answer flag'} />
                        <div>
                            <p className="answerCountry">{props.SubmitGuessState.yourGuessValues.country}</p>
                            <p  className="answerCapital">Capital: {props.SubmitGuessState.yourGuessValues.capital}</p>
                        </div>                            
                    </div>
                </div>
                <div className="correctAnswerDetails">
                    <h3 className="answerDetailsTitle">Correct Answer</h3>
                    <div className="answerCountryCard">
                        <img className="answerFlag" src={baseURL + props.SubmitGuessState.correctAnswerValues.flag} alt={'Correct answer flag'} />
                        <div>
                            <p className="answerCountry">{props.SubmitGuessState.correctAnswerValues.country}</p>
                            <p  className="answerCapital">Capital: {props.SubmitGuessState.correctAnswerValues.capital}</p>
                        </div>
                    </div>
                </div>
                <div className="nextRoundButtonDiv">
                    <span className="nextRoundButton" onClick={nextRound}>Continue</span>
                </div>
            </div>
        );
    }
    else {
        return props.displayNothing;
    }
}
