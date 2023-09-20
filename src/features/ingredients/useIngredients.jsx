import { useContext, useEffect } from "react"
import { IngredientsContext } from "./IngredientsProvider"

import { ingredientsUrl } from '../../config/urls'

export function useIngredients() {

    const { ingredients, setIngredients } = useContext(IngredientsContext)

    useEffect(() => {
        getIngredients()
    }, [])

    async function getIngredients() {
        try {
            const res = await fetch(ingredientsUrl, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const status = res.status
            const data = await res.json()
            if (status === 200) setIngredients(data)
        } catch (err) {
            console.log(err)
        }
    }

    return { ingredients }
}