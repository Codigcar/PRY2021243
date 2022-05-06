export function fieldValidator(number: string) {
    if (!number) return "El campo no puede estar vacío"
    if (!number.match(/^[0-9-]*$/)) return 'El campo solo puede contener números o un -'
    return ''
}