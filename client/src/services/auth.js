import { api, setAuthToken } from "./api"

const TOKEN_KEY = "em_token"
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
  setAuthToken(token)
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  setAuthToken(null)
}

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password })
  saveToken(data.token)
  return data.token
}
export async function signup({ companyName, defaultCurrency, name, email, password }) {
  const { data } = await api.post("/auth/signup", { companyName, defaultCurrency, name, email, password })
  saveToken(data.token)
  return data.token
}
export async function me() {
  const { data } = await api.get("/auth/me")
  return data
}

export function logout() {
  clearToken()
}
