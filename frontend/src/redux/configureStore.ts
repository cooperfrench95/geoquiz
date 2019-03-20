import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { NewGameLink, CurrentRoundState, SubmitGuessState } from './Reducers';

export const ConfigureStore = () => {
    const store = createStore(combineReducers({
        NewGameLink: NewGameLink,
        CurrentRoundState: CurrentRoundState,
        SubmitGuessState: SubmitGuessState
    }),
        applyMiddleware(thunk, logger)
    );
    return store;
};