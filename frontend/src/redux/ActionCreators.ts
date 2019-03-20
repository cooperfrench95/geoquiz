import * as ActionTypes from './ActionTypes';
import { baseURL } from '../shared/baseURL';

export const fetchLink = (difficulty: string, gameMode: string) => async (dispatch: any) => {
    try {
        dispatch(stateLoading(ActionTypes.LINK_LOADING))
        const body = JSON.stringify({ Difficulty: difficulty, Game_mode: gameMode })
        const response = await fetch(baseURL + 'api/link', { method: 'POST', headers: { 'Content-Type':'application/json'}, body: body })
        const linkJson = await response.json()
        const link: string = linkJson.Link
        return dispatch(addState(link, ActionTypes.ADDLINK));
    }
    catch (err) {
        console.log(err);
        return dispatch(stateError(err.message, ActionTypes.LINK_ERROR))
    }
};

export const getGameFromLink = (myLink: string) => async (dispatch: any) => {
    try {
        dispatch(stateLoading(ActionTypes.NEW_GAME_LOADING))
        const body = JSON.stringify({ "Unique code": myLink })
        const response = await fetch(baseURL + 'api/play', { method: 'POST', headers: { 'Content-Type':'application/json'}, body: body })
        const responseJson = await response.json();
        return dispatch(addState(responseJson, ActionTypes.START_GAME));
    }
    catch (err) {
        console.log(err);
        return dispatch(stateError(err.message, ActionTypes.START_GAME_ERROR));
    }
}


export const getNextClue = (clueType: string, token: string, previousPhotoClues?: Array<string>) => async (dispatch: any) => {
    try {
        dispatch(stateLoading(ActionTypes.CLUE_LOADING));
        const body = previousPhotoClues === undefined ? JSON.stringify({ token: token, clueType: clueType })
                                                      : JSON.stringify({token: token, clueType: clueType, "Previous photo clues": previousPhotoClues});
        const response = await fetch(baseURL + 'api/clue', { method: 'POST', headers: { 'Content-Type':'application/json'}, body: body});
        const responseJson = await response.json();
        var clue = responseJson.clue;
        if (clue === null || clue === 'No data') {
            clue = 'No data';
        }
        else {
            switch (clueType) {
                case 'gdp_growth_rate':
                    clue = clue.toString() + '%';
                    break
                case 'population':
                    clue = clue.toLocaleString();
                    break
                case 'education_spending':
                case 'military_spending':
                    clue = clue.toString() + '%' + ' of GDP';
                    break
                case 'gdp_per_capita':
                    clue = '$' + clue + ' (PPP)';
                    break
                case 'hdi':
                    clue = clue.toString();
                    break
                case 'life_expectancy':
                    clue = clue.toString() + ' years';
                    break
                case 'area':
                    clue = clue.toLocaleString() + ' km²';
                    break
                case 'value_of_exports':
                    clue = '$' + clue.toLocaleString() + ' annually';
                    break
                case 'average_temp':
                    clue = clue.toString() + '°C annually';
                    break
                default:
                    clue = clue;
            }
        }
        return dispatch(addState({clue: clue, clueType: clueType}, ActionTypes.ADDCLUE))
    }
    catch (err) {
        return dispatch(stateError(err.message, ActionTypes.CLUE_ERROR))
    }
}

export const makeGuess = (Guess: string, token: string) => async (dispatch: any) => {
    try {
        dispatch(stateLoading(ActionTypes.GUESS_LOADING));
        const body = JSON.stringify({ token: token, Guess: Guess });
        const response = await fetch(baseURL + 'api/guess', { method: 'POST', headers: { 'Content-Type':'application/json'}, body: body});
        const responseJson = await response.json();
        if (responseJson.hasOwnProperty('leaderboard')) {

            return dispatch(addState(responseJson, ActionTypes.ADDFINALGUESS));

        }
        else {

            dispatch(addState({
                    correct: responseJson.correct,
                    correctAnswerValues: responseJson.correctAnswerValues,
                    yourGuessValues: responseJson.yourGuessValues
                }, ActionTypes.ADDGUESS)
            );

            return dispatch(addState({
                    clues: {
                        Photos: [responseJson.clue]
                    },
                    current_round: responseJson.round,
                    current_score: responseJson.score,
                    cluesRemaining: responseJson.cluesRemaining,
                    cluesLimit: responseJson.cluesLimit
                }, ActionTypes.UPDATE_AFTER_GUESS)
            );
        }
    }
    catch (err) {
        return dispatch(stateError(err.message, ActionTypes.GUESS_ERROR))
    }
}
export const addState = (payload: any, actiontype: string) => ({
    type: actiontype,
    payload: payload
});

export const stateLoading = (actiontype: string) => ({
    type: actiontype
});

export const stateError = (errorMessage: string, actiontype: string) => ({
    type: actiontype,
    payload: errorMessage
});

export const resetState = () => ({
    type: ActionTypes.RESET_STATE
});