export function Table({
    columns,
    data,
    toggleOpen = false,
    setRecipe = false,
    disableInteractivity = false
}) {
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
                {data.length === 0 ?
                    <tr>
                        <td colSpan={columns.length}>No hay registros para mostrar.</td>
                    </tr> :
                    data.map((row, idx) => {
                        const accessors = columns.map(col => col.accessor)
                        return (
                            <tr
                                key={idx}
                                className={!disableInteractivity ? 'withHover' : ''}
                                onClick={() => {
                                    if (setRecipe) setRecipe(row)
                                    if (toggleOpen) toggleOpen()
                                }}
                            >
                                {accessors.map((acc, idx) => {
                                    return (
                                        <td key={idx}>
                                            {typeof acc === 'function' ? acc(row) : row[acc] ?? '-'}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}