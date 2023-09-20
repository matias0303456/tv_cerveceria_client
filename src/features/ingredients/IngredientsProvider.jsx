import { useState, createContext } from "react";

export const IngredientsContext = createContext({
    ingredients: [],
    setIngredients: () => { }
})

export function IngredientsProvider({ children }) {

    const [ingredients, setIngredients] = useState([])

    return (
        <IngredientsContext.Provider value={{ ingredients, setIngredients }}>
            {children}
        </IngredientsContext.Provider>
    )
}

