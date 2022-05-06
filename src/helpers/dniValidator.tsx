export function dniValidator(dni: string) {
    if (!dni) return "El DNI no puede estar vacío"
    if(!dni.match(/^[0-9]+$/)) return 'El DNI debe contener solo números'
    if (dni.length < 8) return 'El DNI debe tener 8 dígitos'
    if (dni.length > 8) return 'El DNI no debe tener más de 8 dígitos'
    return ''
}