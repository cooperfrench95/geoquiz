import * as ActionTypes from './ActionTypes';
import * as Types from '../shared/types';

const defaultNewGameLinkState: Types.NewGameLink = {
    link: undefined,
    error: undefined,
    loading: false
}

export const NewGameLink = (state = defaultNewGameLinkState, action: Types.Action) => {
    switch (action.type) {
        case ActionTypes.RESET_STATE:
            return {...defaultNewGameLinkState}
        case ActionTypes.ADDLINK:
            return {...state, link: action.payload, error: undefined, loading: false}
        case ActionTypes.LINK_ERROR:
            return {...state, link: undefined, error: action.payload, loading: false}
        case ActionTypes.LINK_LOADING:
            return {...state, link: undefined, error: undefined, loading: true}
        default:
            return state;
    }
};

const defaultCurrentRoundState: Types.CurrentRoundState = {
    clues: {
        Photos: []
    },
    clueLoading: false,
    clueError: undefined,
    cluesLimit: 0,
    cluesRemaining: 0,
    current_round: 0,
    current_score: -1,
    token: '',
    game_mode: ''
};

export const CurrentRoundState = (state = defaultCurrentRoundState, action: Types.Action) => {
    switch (action.type) {
        case ActionTypes.RESET_STATE:
            return {...defaultCurrentRoundState}
        case ActionTypes.START_GAME:
            return {...defaultCurrentRoundState, 
                clues: { 
                    Photos: [action.payload.clue] 
                },
                cluesLimit: action.payload.cluesLimit,
                cluesRemaining: action.payload.cluesRemaining,
                current_round: action.payload.round,
                current_score: action.payload.score,
                token: action.payload.token,
                game_mode: action.payload.game_mode
            }
        case ActionTypes.START_GAME_ERROR:
            return {...defaultCurrentRoundState, clueError: action.payload}
        case ActionTypes.NEW_GAME_LOADING:
            return {...defaultCurrentRoundState, clueLoading: true, clueError: undefined}
        case ActionTypes.ADDCLUE:
            switch (action.payload.clueType) {
                case 'Photo':
                    return {    
                                ...state, 
                                cluesRemaining: state.cluesRemaining - 1, 
                                clues: {
                                    ...state.clues, 
                                    Photos: [...state.clues.Photos, action.payload.clue]
                                }, 
                                clueLoading: false, 
                                clueError: undefined
                            }
                default:
                    return {
                                ...state, 
                                cluesRemaining: state.cluesRemaining - 1, 
                                clues: { 
                                    ...state.clues, 
                                    [action.payload.clueType]: action.payload.clue 
                                }, 
                                clueLoading: false, 
                                clueError: undefined
                            }
            };
        case ActionTypes.CLUE_ERROR:
            return {...state, clueError: action.payload, clueLoading: false}
        case ActionTypes.CLUE_LOADING:
            return {...state, clueLoading: true, clueError: undefined}
        case ActionTypes.UPDATE_AFTER_GUESS:
            return {...state, ...action.payload, clueError: undefined, clueLoading: false}
        default:
            return state;
    }
};

const defaultSubmitGuessState: Types.SubmitGuessState = {
    guessLoading: false,
    guessError: undefined,
    correct: undefined,
    correctAnswerValues: {
        capital: undefined,
        flag: undefined,
        country: undefined
    },
    yourGuessValues: {
        capital: undefined,
        flag: undefined,
        country: undefined
    }
};

export const SubmitGuessState = (state = defaultSubmitGuessState, action: Types.Action) => {
    switch (action.type) {
        case ActionTypes.RESET_STATE:
            return {...defaultSubmitGuessState}
        case ActionTypes.ADDGUESS:
            return {...defaultSubmitGuessState, ...action.payload}
        case ActionTypes.ADDFINALGUESS:
            return {...state, ...action.payload}
        case ActionTypes.GUESS_ERROR:
            return {...defaultSubmitGuessState, guessError: action.payload} 
        case ActionTypes.GUESS_LOADING:
            return {...defaultSubmitGuessState, guessLoading: true}
        default:
            return state;
    }
};