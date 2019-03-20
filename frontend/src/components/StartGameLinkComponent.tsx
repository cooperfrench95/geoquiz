import * as React from 'react';
import * as Types from '../shared/types';
import { Loading } from './LoadingComponent';

export const NewGameLoader = (props: Types.NewGameLoaderProps) => {
    
    React.useEffect(() => {
        if (props.CurrentRoundState.current_round === 0) {
            props.getGameFromLink(props.match.params.code);
        }
        else {
            props.history.push('/play');
        }
    }, [props.CurrentRoundState.token, props.CurrentRoundState.current_round, props.CurrentRoundState.cluesLimit, props.CurrentRoundState.cluesRemaining])
    
    return(
        <Loading />
    )
}