export function licenseValidator(license: string) {
    if (!license) return "La licencia no puede estar vacía"
    // if (license.length < 8) return 'La licencia debe tener 8 dígitos'
    // if (license.length > 8) return 'La licencia no debe tener más de 8 dígitos'
    // if(!license.match(/^[0-9]+$/)) return 'La licencia debe contener solo números'
    return ''
}