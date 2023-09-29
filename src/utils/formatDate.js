export function formatTimestamp(value) {
    if (value.length === 0) return ''
    const date = new Date(value)
    return date.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
        .replaceAll('/', '-')
        .replaceAll(',', ' ')
}

export function formatDate(value) {
    if (value.length === 0) return ''
    const date = value.split('T')[0]
    const [year, month, day] = date.split('-')
    return `${day}-${month}-${year}`
}