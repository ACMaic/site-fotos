export const hubspotCookie = () => {
  return document.cookie.replace(/(?:(?:^|.*;\s*)hubspotutk\s*=\s*([^;]*).*$)|^.*$/, '$1')
}
