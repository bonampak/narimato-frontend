import React from "react";

function useMergeState(initialState: any) {
    const [state, setState] = React.useState(initialState);
    const setMergedState = (newState: any) => {
        return setState((prevState: any) => Object.assign({}, prevState, newState));
    };
    return [state, setMergedState];
}

export default useMergeState;
