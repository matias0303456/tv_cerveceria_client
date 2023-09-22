import { Table } from "../../components/Table";

export function RecordsPage() {

    const columns = ['id', 'nombre', 'edad']
    const data = [
        { id: 1, name: 'sdfs', age: 3 },
        { id: 2, name: 'aaa', age: 3234 },
        { id: 3, name: 'bb', age: 33 },
    ]

    return (
        <>
            <Table columns={columns} data={data} />
        </>
    )
}