import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import * as ActionCreators from '../redux/ActionCreators';
import { Home } from './HomeComponent';
import { ReduxState, MainProps } from '../shared/types';
import { Round } from './RoundComponent';
import { Loading } from './LoadingComponent';
import { NewGameLoader } from './StartGameLinkComponent';
import { GameOver } from './GameCompleteComponent';

const mapStateToProps = (state: ReduxState) => {
    return {
        NewGameLink: state.NewGameLink,
        CurrentRoundState: state.CurrentRoundState,
        SubmitGuessState: state.SubmitGuessState
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    fetchLink: (diff: string, gamemode: string) => dispatch(ActionCreators.fetchLink(diff, gamemode)),
    makeGuess: (Guess: string, token: string) => dispatch(ActionCreators.makeGuess(Guess, token)),
    getNextClue: (clueType: string, token: string, previousPhotoClues?: Array<string>) => dispatch(ActionCreators.getNextClue(clueType, token, previousPhotoClues)),
    getGameFromLink: (myLink: string) => dispatch(ActionCreators.getGameFromLink(myLink)),
    resetState: () => dispatch(ActionCreators.resetState())
});


const Main = (props: MainProps) => {

    const [isLoading, setNotLoading] = React.useState(true)
    setTimeout(() => setNotLoading(false), 1000);

    if (isLoading) {
        return <Loading />
    }
    else {
        return(
            <div>
                <Switch>
                    <Route exact path="/home" render={(RouterProps) => <Home {...RouterProps} NewGameLink={props.NewGameLink} fetchLink={props.fetchLink} />}/>
                    <Route exact path="/end" render={(RouterProps) => <GameOver {...RouterProps} CurrentRoundState={props.CurrentRoundState} SubmitGuessState={props.SubmitGuessState} resetState={props.resetState} />}/>
                    <Route exact path="/play" render={(RouterProps) => <Round {...RouterProps} SubmitGuessState={props.SubmitGuessState} makeGuess={props.makeGuess} getNextClue={props.getNextClue} CurrentRoundState={props.CurrentRoundState}/>}/>
                    <Route exact path="/play/:code" render={(RouterProps) => <NewGameLoader {...RouterProps} getGameFromLink={props.getGameFromLink} CurrentRoundState={props.CurrentRoundState}/>}/>
                    <Redirect to="/home" />
                </Switch>
            </div>
        );
    }   
    
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));