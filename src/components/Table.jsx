export function Table({ columns, data }) {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((col, idx) => {
                        return (
                            <th key={idx}>{col}</th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {data.map(row => {
                    return (
                        <tr key={row.id}>
                            {Object.keys(row).map((key, idx) => {
                                return (
                                    <td key={idx}>
                                        {row[key]}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}