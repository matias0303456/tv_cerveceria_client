import { useContext } from "react"

import { useIngredientsOnRecipes } from "../ingredients-on-recipes/useIngredientsOnRecipes"
import { useIngredients } from "../ingredients/useIngredients"
import { RecipesContext } from "./RecipesProvider"
import { Table } from "../../components/Table"
import { useUnits } from "../units/useUnits"

import { errorToast, successToast } from "../../utils/toaster"

export function FormStep2({
    newIngredient,
    setNewIngredient,
    ingredientsOnRecipe,
    setIngredientsOnRecipe,
    recipe,
    setRecipe
}) {

    const { recipes, setRecipes } = useContext(RecipesContext)

    const { ingredients } = useIngredients()
    const { units } = useUnits()
    const { createIngredientOnRecipe, deleteIngredientOnRecipe } = useIngredientsOnRecipes()

    const handleChangeIngredients = e => {
        setNewIngredient({
            ...newIngredient,
            [e.target.name]: e.target.value
        })
    }

    const validateIngredient = () => {
        let flag = true
        let message = ''
        let errors = {
            'ingredient_id': 'Nombre requerido.',
            'amount': 'Cantidad requerida.',
            'unit_id': 'Unidad requerida.'
        }
        Object.keys(newIngredient).forEach(key => {
            if (newIngredient[key].length === 0) {
                message += `- ${errors[key]}\n`
                flag = false
            }
        })
        if (!flag) {
            errorToast(message)
        }
        return flag
    }

    const handleAddIngredient = async () => {
        if (ingredientsOnRecipe.some(item => (item.ingredient?.id ?? parseInt(item.ingredient_id)) === parseInt(newIngredient.ingredient_id))) {
            errorToast(`Ya existe un ingrediente ${ingredients.find(ing => ing.id === parseInt(newIngredient.ingredient_id)).name} en esta receta.`)
            return false
        }
        const isValid = validateIngredient()
        if (isValid) {
            if (edit) {
                const value = { ...newIngredient, recipe_id: parseInt(recipe.id) }
                const { status, data } = await createIngredientOnRecipe(value)
                if (status === 200) {
                    setRecipes([
                        ...recipes.filter(item => item.id !== recipe.id),
                        {
                            ...recipe,
                            ingredients: [...recipe.ingredients, data]
                        }
                    ])
                    setIngredientsOnRecipe([...ingredientsOnRecipe, data])
                    setNewIngredient({
                        ingredient_id: '',
                        amount: '',
                        unit_id: ''
                    })
                    successToast('Ingrediente añadido correctamente a esta receta.')
                } else {
                    errorToast(data.message)
                }
            } else {
                setIngredientsOnRecipe([...ingredientsOnRecipe, newIngredient])
                setNewIngredient({
                    ingredient_id: '',
                    amount: '',
                    unit_id: ''
                })
            }
        }
    }

    const columnsIngredients = [
        { label: '#', accessor: data => data.ingredient?.id ?? data.id ?? '-' },
        { label: 'Nombre', accessor: data => data.ingredient?.name ?? ingredients.find(ing => ing.id === parseInt(data.ingredient_id)).name },
        { label: 'Cantidad', accessor: 'amount' },
        { label: 'Unidad', accessor: data => data.unit?.name ?? units.find(u => u.id === parseInt(data.unit_id)).name },
        {
            label: '',
            accessor: row => (
                <button style={{ width: 20, marginBottom: 20 }} onClick={async () => {
                    if (edit) {
                        const { status, data } = await deleteIngredientOnRecipe(recipe.id, row.ingredient.id)
                        if (status === 200) {
                            setIngredientsOnRecipe([...ingredientsOnRecipe.filter(item => item.ingredient.id !== data.ingredient_id)])
                            setRecipes([
                                ...recipes.filter(item => item.id !== recipe.id),
                                {
                                    ...recipe,
                                    ingredients: [...recipe.ingredients.filter(ing => ing.ingredient.id !== data.ingredient_id)]
                                }])
                            setRecipe({
                                ...recipe,
                                ingredients: [...recipe.ingredients.filter(ing => ing.ingredient.id !== data.ingredient_id)]
                            })
                            successToast('Ingrediente eliminado correctamente de esta receta.')
                        } else {
                            errorToast(data.message)
                        }
                    } else {
                        setIngredientsOnRecipe([...ingredientsOnRecipe.filter(item => parseInt(item.ingredient_id) !== parseInt(row.ingredient_id))])
                    }
                }}>
                    X
                </button>
            )
        }
    ]

    return (
        <>
            <p style={{ textAlign: 'center' }}>Ingredientes</p>
            <div style={{ width: '50%', margin: '0 auto', marginTop: 10 }}>
                <Table
                    columns={columnsIngredients}
                    data={ingredientsOnRecipe}
                    disableInteractivity
                />
            </div>
            <div style={{ width: '50%', margin: '0 auto', marginTop: 10 }}>
                <form onChange={handleChangeIngredients}>
                    <label htmlFor="ingredient_id">Nombre</label>
                    <select name="ingredient_id" value={newIngredient.ingredient_id}>
                        <option value="">Seleccione</option>
                        {ingredients.map(ing => {
                            return <option key={ing.id} value={ing.id}>{ing.name}</option>
                        })}
                    </select>
                    <label htmlFor="amount">Cantidad</label>
                    <input type="number" name="amount" min={0} value={newIngredient.amount} />
                    <label htmlFor="amount">Unidad</label>
                    <select name="unit_id" value={newIngredient.unit_id}>
                        <option value="">Seleccione</option>
                        {units.map(u => {
                            return <option key={u.id} value={u.id}>{u.name}</option>
                        })}
                    </select>
                    <button
                        type="button"
                        style={{ width: '20%' }}
                        onClick={handleAddIngredient}
                    >
                        Añadir
                    </button>
                </form>
            </div>
        </>
    )
}