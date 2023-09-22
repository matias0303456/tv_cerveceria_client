import { Table } from "../../components/Table";

export function RecipesPage() {

    const columns = ['id', 'direccion', 'pais']
    const data = [
        { id: 11, address: 'asdsddssds', country: 'arg' },
        { id: 2123213, address: 'xxxxxxxx', country: 'col' },
        { id: 345345433, address: 'yyyyyyyy', country: 'bra' },
    ]

    return (
        <>
            <Table columns={columns} data={data} />
        </>
    )
}