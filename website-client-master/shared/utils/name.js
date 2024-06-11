export const formatName = (name = '') => {
  let firstName = ''
  let lastName = ''

  if (name) {
    const space = name.indexOf(' ')
    firstName = name.substring(0, space)
    lastName = name.substring(space + 1)
  }

  return {
    firstName,
    lastName
  }
}
