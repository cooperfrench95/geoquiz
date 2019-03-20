import * as React from 'react';
import { ScaleLoader, PulseLoader } from 'halogenium';
import * as Types from '../shared/types';

const styles = {
    position: "fixed" as "fixed", 
    top: "40%", 
    left: "50%", 
    transform: "translate(-50%, -50%)"
}

export const Loading = (props: Types.LoadingProps) => {
    if (props.style) {
        return(
            <PulseLoader color={"#43F2DA"} size={props.size} margin={props.margin} style={props.style} />
        );
    }
    else {
        return(
            <div>
                <ScaleLoader color={"#43F2DA"} size="100px" margin="5px" style={styles} />
            </div>
        );
    }
}