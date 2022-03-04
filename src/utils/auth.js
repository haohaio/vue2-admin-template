export const TokenKey = 'Token'
export const UserNameKey = 'User'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getUsername() {
  return localStorage.getItem(UserNameKey)
}

export function setUsername(username) {
  return localStorage.setItem(UserNameKey, username)
}

export function removeUsername() {
  return localStorage.removeItem(UserNameKey)
}
