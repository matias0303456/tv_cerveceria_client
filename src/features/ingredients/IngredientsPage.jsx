import { useEffect, useState } from "react"

import { useIngredients } from "./useIngredients"
import { Form } from "./Form"
import { IngredientCard } from "./IngredientCard"

export function IngredientsPage() {

    const { ingredients } = useIngredients()

    const [current, setCurrent] = useState({
        id: 0,
        name: '',
        type_id: ''
    })

    const [edit, setEdit] = useState(false)

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ width: '20%' }}>
                <Form
                    current={current}
                    setCurrent={setCurrent}
                    edit={edit}
                    setEdit={setEdit}
                />
            </div>
            <div style={{
                width: '60%',
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: 10
            }}>
                {ingredients.filter(ing => !edit || current.id === ing.id).map(ing => (
                    <IngredientCard
                        key={ing.id}
                        ingredient={ing}
                        current={current}
                        setCurrent={setCurrent}
                        edit={edit}
                        setEdit={setEdit}
                    />
                ))}
            </div>
        </div>
    )
}