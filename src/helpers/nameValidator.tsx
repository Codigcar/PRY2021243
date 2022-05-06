export function nameValidator(name: string) {
    if (!name) return "El nombre no puede estar vacío"
    if (!/^[a-zA-Z ]+$/.test(name)) return 'El nombre debe contener solo letras'
    return ''
}