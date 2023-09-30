import { useState } from "react";

import { Table } from "../../components/Table";
import { useRecipes } from "./useRecipes";
import { RecipesModal } from "./RecipesModal";

export function RecipesPage() {

    const { recipes } = useRecipes()

    const [open, setOpen] = useState(false)
    const [edit, setEdit] = useState(false)
    const [recipe, setRecipe] = useState({
        name: '',
        style: '',
        alcohol_content: '',
        initial_density: '',
        final_density: '',
        ibu: '',
        time: '',
        macerate_alarms: [],
        boil_alarms: [],
        ingredients: []
    })

    const toggleOpen = () => setOpen(!open)

    const columnsRecipes = [
        { label: '#', accessor: 'id' },
        { label: 'Nombre', accessor: 'name' },
        { label: '% Alcohol', accessor: 'alcohol_content' },
        { label: 'Densidad inicial', accessor: 'initial_density' },
        { label: 'Densidad final', accessor: 'final_density' },
        { label: 'IBU', accessor: 'ibu' },
        { label: 'Estilo', accessor: 'style' },
        { label: 'Tiempo', accessor: 'time' }
    ]

    return (
        <>
            <button style={{ width: '10%', marginBottom: 10 }} onClick={toggleOpen}>
                Nueva
            </button>
            <RecipesModal
                open={open}
                toggleOpen={() => {
                    setEdit(false)
                    toggleOpen()
                }}
                recipe={recipe}
                setRecipe={setRecipe}
                edit={edit}
            />
            <Table
                columns={columnsRecipes}
                data={recipes}
                setEntity={row => setRecipe(recipes.find(item => item.id === row.id))}
                toggleOpen={() => {
                    setEdit(true)
                    toggleOpen()
                }}
            />
        </>
    )
}