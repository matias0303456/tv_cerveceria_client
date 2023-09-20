import { useIngredients } from "./useIngredients"

export function IngredientsPage() {

    const { ingredients } = useIngredients()

    return (
        <>
            <h2>Ingredients</h2>
        </>
    )
}