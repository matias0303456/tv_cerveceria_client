import { useContext, useEffect } from "react";

import { RecipesContext } from "./RecipesProvider";

import { recipesUrl } from "../../config/urls";

export function useRecipes() {

    const { recipes, setRecipes } = useContext(RecipesContext)

    useEffect(() => {
        getRecipes()
    }, [])

    async function getRecipes() {
        try {
            const res = await fetch(recipesUrl, {
                headers: { 'Content-Type': 'application/json' }
            })
            const status = res.status
            const data = await res.json()
            if (status === 200) setRecipes(data)
        } catch (err) {
            console.log(err)
        }
    }

    async function createRecipe(recipe) {
        try {
            const res = await fetch(recipesUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipe)
            })
            const status = res.status
            const data = await res.json()
            return { status, data }
        } catch (err) {
            console.log(err)
        }
    }

    return { recipes, createRecipe }
}