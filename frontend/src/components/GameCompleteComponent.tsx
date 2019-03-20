import * as React from 'react';
import * as Types from '../shared/types';
import { config } from 'react-spring';
import { Spring, animated } from 'react-spring/renderprops';

export const GameOver = (props: Types.GameOverProps) => {

    if (props.CurrentRoundState.token === "") {
        props.history.push('/home');
    }
    
    const homeButton = <div onClick={() => {props.history.push('/home'); props.resetState()}} className="homebutton animated fadeInUp delay-3s">Home</div>;

    const leaderboard = () => {
        if (props.SubmitGuessState.leaderboard !== undefined) {
            var leaderboardArray = [...props.SubmitGuessState.leaderboard, props.SubmitGuessState.final_score].sort((a, b) => b! - a!);
            if (leaderboardArray.length > 5) {
                leaderboardArray = leaderboardArray.slice(0, 5);
            }
            return(
              leaderboardArray.map((score, index) => {
                if (score === props.SubmitGuessState.final_score) {
                    var style = {fontSize: "26pt"};
                    var you = "(You)";
                }  
                else {
                    style = {fontSize: "18pt"}
                    you = ""
                }
                return(
                    <Spring
                        native
                        from={{ transform: 'translate3d(-2000px,0,0)', opacity: 0 }}
                        to={{ transform: 'translate3d(0px,0,0)', opacity: 1 }}
                        delay={index * 100 + 2000}
                        >
                        {props => 
                        <animated.div style={props} className="leaderboardEachLineDiv">
                            <span style={style}>{index + 1} {you}</span>
                            <span style={style}>{score === undefined ? null : score.toFixed(2)}</span>
                        </animated.div>
                        }
                    </Spring>
                    
                  );
              })  
            );
        }
        else {
            return(
                <div style={{display: "none", width: 0, height: 0}}>
                </div>
            );
        }
    }

    return( // Add the button
        <div>
            <div className="homePageOuterDiv"></div>
            <div className="homePageFlexContainer">
                <div className="finalScoreDiv animated fadeInDown">
                    <h1 className="finalScoreHeading">Final Score</h1>
                    <Spring
                        from={{number: 0}}
                        to={{number: props.SubmitGuessState.final_score}}
                        config={config.wobbly}
                    >
                        {props => <span className="finalScore">{props.number ? Math.floor(props.number): ''}</span>}
                    </Spring>
                    
                </div>
                <div className="leaderboardDiv">
                    <h2 className="leaderboardHeading animated fadeInDown delay-2s">Leaderboard</h2>
                    <div className="leaderboardInnerDiv">
                        {leaderboard()}
                    </div>
                </div>
                {homeButton}
            </div>
        </div>
    );
}