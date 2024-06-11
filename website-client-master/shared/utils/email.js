const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const checkForDuplicates = (array) => {
  return new Set(array).size !== array.length
}

export const validateEmail = (email) => {
  if (!email) { return }
  const domains = email.split('.')
  return regex.test(email) && !checkForDuplicates(domains)
}
