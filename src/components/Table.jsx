export function Table({ columns, data }) {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((col, idx) => {
                        return (
                            <th key={idx}>{col.label}</th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {data.map(row => {
                    const accessors = columns.map(col => col.accessor)
                    return (
                        <tr key={row.id}>
                            {accessors.map((acc, idx) => {
                                return (
                                    <td key={idx}>{row[acc]}</td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}