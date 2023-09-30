import { ingredientsOnRecipesUrl } from "../../config/urls"

export function useIngredientsOnRecipes() {

    async function createIngredientOnRecipe(ingredientOnRecipe) {
        try {
            const res = await fetch(ingredientsOnRecipesUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ingredientOnRecipe)
            })
            const status = res.status
            const data = await res.json()
            return { status, data }
        } catch (err) {
            console.log(err)
        }
    }

    async function deleteIngredientOnRecipe(recipe, row) {
        try {
            const res = await fetch(ingredientsOnRecipesUrl + `/${recipe}/${row}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            const status = res.status
            const data = await res.json()
            return { status, data }
        } catch (err) {
            console.log(err)
        }
    }

    return { createIngredientOnRecipe, deleteIngredientOnRecipe }
}