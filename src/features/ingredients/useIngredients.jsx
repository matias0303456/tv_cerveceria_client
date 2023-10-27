import { useContext, useEffect } from "react"
import { IngredientsContext } from "./IngredientsProvider"

import { ingredientsUrl } from '../../config/urls'

export function useIngredients() {

    const { ingredients, setIngredients } = useContext(IngredientsContext)

    useEffect(() => {
        getIngredients()
    }, [])

    async function getIngredients(search) {
        try {
            const res = await fetch(ingredientsUrl + (search ? `?search=${search}` : ''), {
                headers: { 'Content-Type': 'application/json' }
            })
            const status = res.status
            const data = await res.json()
            if (status === 200) setIngredients(data)
        } catch (err) {
            console.log(err)
        }
    }

    async function createIngredient(ingredient) {
        try {
            const res = await fetch(ingredientsUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ingredient)
            })
            const status = res.status
            const data = await res.json()
            return { status, data }
        } catch (err) {
            console.log(err)
        }
    }

    async function editIngredient(ingredient) {
        try {
            const res = await fetch(ingredientsUrl + `/${ingredient.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ingredient)
            })
            const status = res.status
            const data = await res.json()
            return { status, data }
        } catch (err) {
            console.log(err)
        }
    }

    async function deleteIngredient(id) {
        try {
            const res = await fetch(ingredientsUrl + `/${id}`, {
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

    return { getIngredients, ingredients, createIngredient, editIngredient, deleteIngredient }
}