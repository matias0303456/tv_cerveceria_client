import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { useIngredients } from "./useIngredients"
import { Form } from "./Form"
import { IngredientCard } from "./IngredientCard"

export function IngredientsPage() {

    const { ingredients, getIngredients } = useIngredients()

    const [searchParams, setSearchParams] = useSearchParams()

    const [current, setCurrent] = useState({
        id: 0,
        name: '',
        type_id: ''
    })
    const [edit, setEdit] = useState(false)

    const handleSearch = e => {
        setSearchParams({ search: e.target.value })
    }

    useEffect(() => {
        getIngredients(searchParams.get('search'))
    }, [searchParams])

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <div id="newIngForm">
                <Form
                    current={current}
                    setCurrent={setCurrent}
                    edit={edit}
                    setEdit={setEdit}
                />
            </div>
            <div
                style={{
                    width: '60%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
                {ingredients.length > 0 &&
                    <search>
                        <input
                            type="text"
                            name="search"
                            placeholder="Buscar..."
                            onChange={handleSearch}
                        />
                    </search>
                }
                <div style={{
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
        </div>
    )
}