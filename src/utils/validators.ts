export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
}

export function isValidPhone(phone: string): boolean {
  return /^(09(0[1-5]|1[0-9]|2[0-3]|3[0-9]|9[0-3]))\d{7}$/.test(phone)
}