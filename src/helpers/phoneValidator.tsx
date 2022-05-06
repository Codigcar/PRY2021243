export function phoneValidator(phone: string) {
    if (!phone) return "El número no puede estar vacío"
    if(!phone.match(/^[0-9]+$/)) return 'El télefono debe contener solo números'
    if (phone.length < 9) return 'El número debe tener 9 dígitos'
    if (phone.length > 9) return 'El número no debe tener más de 9 dígitos'
    return ''
}