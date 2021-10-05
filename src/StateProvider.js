//Declares some states globally so that we dont have to pass them from highest generation to lowest generation through props again and again
import React, {createContext, useContext, useReducer} from 'react';

export const StateContext = createContext();
export const StateProvider = ({
    reducer, initialState, children}) => (
        <StateContext.Provider value = {useReducer(reducer, initialState)}>
            {children}
        </StateContext.Provider>
    );

export const useStateValue = () => useContext(StateContext);