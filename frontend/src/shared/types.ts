import { RouteComponentProps, match, Route } from 'react-router';

export type Undefinable<T> = T | undefined;

export interface AnswerProps {
    SubmitGuessState: SubmitGuessState;
    toggleAnswerComponent: (param: boolean) => void;
    displayNothing: any;
    push: (path: string) => void;
}

export interface GameOverProps extends RouteComponentProps {
    SubmitGuessState: SubmitGuessState;
    CurrentRoundState: CurrentRoundState;
    resetState: () => void;
}

export interface MainProps extends RouteComponentProps<any> {
    NewGameLink: any;
    CurrentRoundState: any;
    SubmitGuessState: any;
    fetchLink: (diff: string, gamemode: string) => void;
    makeGuess: (Guess: string, token: string) => void;
    getNextClue: (clueType: string, token: string, previousPhotoClues?: Array<string>) => void;
    getGameFromLink: (myLink: string) => void;
    resetState: () => void;
};

export interface ReduxState {
    NewGameLink: NewGameLink;
    CurrentRoundState: CurrentRoundState;
    SubmitGuessState: SubmitGuessState;
};

export interface HomeProps extends RouteComponentProps<any> {
    NewGameLink: {
        link: Undefinable<string>;
        loading: boolean;
        error: Undefinable<string>;
    };
    fetchLink: (diff: string, gamemode: string) => void;
};

export interface SubmitGuessState {
    guessLoading: boolean,
    guessError: Undefinable<string>,
    correct: Undefinable<boolean>, 
    final_score?: number, 
    leaderboard?: Array<number>, 
    highscore?: boolean,
    correctAnswerValues: {
        capital: Undefinable<string>,
        flag: Undefinable<string>,
        country: Undefinable<string>
    },
    yourGuessValues: {
        capital: Undefinable<string>,
        flag: Undefinable<string>,
        country: Undefinable<string>
    }
};

export interface NewGameLoaderProps extends RouteComponentProps {
    getGameFromLink: (myLink: string) => void;
    CurrentRoundState: CurrentRoundState;
    match: customMatch;
}

export interface customMatch extends match {
    isExact: boolean;
    params: {
        code: string;
    };
    path: string;
    url: string;
}

export type countryCoordinate = {
    name: string,
    coordinates: [number, number]
}

export interface ClueViewerProps {
    CurrentRoundState: CurrentRoundState,
    getNextClue: (clueType: string, token: string, previousPhotoClues?: Array<string>) => void;
}

export interface CurrentRoundState {
    clues: {
        [key: string]: any;
        Photos: Array<string>,
        gdp_growth_rate?: string,
        population?: string,
        languages?: string,
        region?: string,
        religion?: string,
        capital?: string,
        education_spending?: string,
        military_spending?: string,
        gdp_per_capita?: string,
        flag?: string,
        hdi?: string,
        life_expectancy?: string,
        area?: string,
        value_of_exports?: string,
        currency?: string,
        average_temp?: string
    },
    game_mode: string, 
    current_round: number, 
    current_score: number, 
    cluesRemaining: number, 
    cluesLimit: number,
    token: string,
    clueLoading: boolean,
    clueError: Undefinable<string>;
};

export type Action = {
    type: string;
    payload?: any;
};

export interface NewGameLink {
    link: Undefinable<string>;
    error: Undefinable<string>;
    loading: boolean;
};

export interface RoundProps extends RouteComponentProps<any> {
    CurrentRoundState: CurrentRoundState;
    SubmitGuessState: SubmitGuessState;
    getNextClue: (clueType: string, token: string, previousPhotoClues?: Array<string>) => void;
    makeGuess: (Guess: string, token: string) => void;
};

export interface LoadingProps {
    style?: any,
    size?: string,
    margin?: string
}