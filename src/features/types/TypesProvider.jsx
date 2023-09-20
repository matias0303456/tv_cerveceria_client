import { useState, createContext } from "react";

export const TypesContext = createContext({
    types: [],
    setTypes: () => { }
})

export function TypesProvider({ children }) {

    const [types, setTypes] = useState([])

    return (
        <TypesContext.Provider value={{ types, setTypes }}>
            {children}
        </TypesContext.Provider>
    )
}

