import { createContext, useState } from "react";

export const RecipesContext = createContext({
    recipes: [],
    setRecipes: () => { }
})

export function RecipesProvider({ children }) {

    const [recipes, setRecipes] = useState([])

    return (
        <RecipesContext.Provider value={{ recipes, setRecipes }}>
            {children}
        </RecipesContext.Provider>
    )
}