// Requests for the Express API. The mock module exposes the same functions.

const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const token = localStorage.getItem('ascii-garden:session')
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...options,
  })

  if (!response.ok) {
    // Prefer the API's message when it returned one.
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // Keep the HTTP status when the response body is not JSON.
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export async function signup(input) {
  const result = await request('/api/auth/signup', { method: 'POST', body: JSON.stringify(input) })
  localStorage.setItem('ascii-garden:session', result.token)
  localStorage.setItem('ascii-garden:id', result.garden.id)
  return result.garden
}
export async function login(input) {
  const result = await request('/api/auth/login', { method: 'POST', body: JSON.stringify(input) })
  localStorage.setItem('ascii-garden:session', result.token)
  localStorage.setItem('ascii-garden:id', result.garden.id)
  return result.garden
}
export const getGarden = () => localStorage.getItem('ascii-garden:id') ? request('/api/garden') : Promise.reject(new Error('No garden found.'))
export const saveGarden = (garden) => request('/api/garden', { method: 'PUT', body: JSON.stringify(garden) })
