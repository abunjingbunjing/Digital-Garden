const KEY = 'ascii-garden:account'
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))
function read() { try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null } }
function write(account) { localStorage.setItem(KEY, JSON.stringify(account)); return account }
function emptyGarden(username, gardenName) {
  return { id: crypto.randomUUID(), username, gardenName, startedAt: new Date().toISOString(), lastWateredAt: null, waterUsed: 0, collection: [], beds: Array.from({ length: 5 }, (_, bed) => ({ id: bed + 1, locked: bed > 0, slots: Array.from({ length: 5 }, (_, slot) => ({ id: slot + 1, plant: null })) })) }
}
export async function signup(input) { await delay(); if (read()) throw new Error('A garden already lives in this browser. Log in or clear demo data.'); const garden = emptyGarden(input.username.trim(), input.gardenName.trim()); write({ ...garden, password: input.password }); return garden }
export async function login(input) { await delay(); const account = read(); if (!account || account.username !== input.username || account.password !== input.password) throw new Error('Username or password is not correct.'); const { password, ...garden } = account; return garden }
export async function getGarden() { await delay(); const account = read(); if (!account) throw new Error('No garden found.'); const { password, ...garden } = account; return garden }
export async function saveGarden(garden) { await delay(); const account = read(); if (!account) throw new Error('No garden found.'); write({ ...garden, password: account.password }); return garden }
