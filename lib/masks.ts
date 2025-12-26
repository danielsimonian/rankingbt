/**
 * Aplicar máscara de telefone brasileiro
 * Aceita: (13) 99999-9999 ou (13) 9999-9999
 */
export function phoneMask(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara conforme a quantidade de dígitos
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else {
    // Com 9º dígito (celular)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
}

/**
 * Remove máscara do telefone (retorna só números)
 */
export function phoneUnmask(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Validar telefone (mínimo 10 dígitos)
 */
export function isValidPhone(value: string): boolean {
  const numbers = phoneUnmask(value);
  return numbers.length >= 10 && numbers.length <= 11;
}