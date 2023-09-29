import { createContext, useState } from "react";

export const RecordsContext = createContext({
    records: [],
    setRecords: () => { }
})

export function RecordsProvider({ children }) {

    const [records, setRecords] = useState([])

    return (
        <RecordsContext.Provider value={{ records, setRecords }}>
            {children}
        </RecordsContext.Provider>
    )
}