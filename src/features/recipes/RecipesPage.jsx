import { Table } from "../../components/Table";
import { useRecipes } from "./useRecipes";

export function RecipesPage() {

    const { recipes } = useRecipes()

    const columns = [
        { accessor: 'id', label: '#' },
        { accessor: 'name', label: 'Nombre' },
        { accessor: 'alcohol_content', label: '% Alcohol' },
        { accessor: 'initial_density', label: 'Densidad inicial' },
        { accessor: 'final_density', label: 'Densidad final' },
        { accessor: 'ibu', label: 'IBU' },
        { accessor: 'style', label: 'Estilo' },
        { accessor: 'time', label: 'Tiempo' }
    ]

    return (
        <>
            <Table columns={columns} data={recipes} />
        </>
    )
}