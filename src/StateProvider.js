//Declares some states globally so we dont have to pass thm from highest generation to lowest through props again and again
import React, {createContext, useContext, useReducer} from 'react';

export const StateContext = createContext();
export const StateProvider = ({
    reducer, initialState, children}) => (
        <StateContext.Provider value = {useReducer(reducer, initialState)}>
            {children}
        </StateContext.Provider>
    );

export const useStateValue = () => useContext(StateContext);