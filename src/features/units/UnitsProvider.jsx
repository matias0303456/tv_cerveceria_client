import { useState, createContext } from "react";

export const UnitsContext = createContext({
    units: [],
    setUnits: () => { }
})

export function UnitsProvider({ children }) {

    const [units, setUnits] = useState([])

    return (
        <UnitsContext.Provider value={{ units, setUnits }}>
            {children}
        </UnitsContext.Provider>
    )
}

