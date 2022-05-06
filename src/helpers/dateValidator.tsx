export function dateValidator(date: string) {
    if (!date) return "La fecha no puede estar vacía"
    if (!date.match(/^\d{2}\/\d{2}\/\d{4}$/)) return 'La fecha debe tener el formato dd/mm/aaaa'
    return ''
}