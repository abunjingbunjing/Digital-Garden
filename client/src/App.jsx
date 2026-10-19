import { useEffect, useState } from 'react'
import { getGarden, login, saveGarden, signup } from './api'
import DemoNotice from './components/DemoNotice.jsx'

const emptyAuth = { username: '', password: '', gardenName: '' }
const maxCharacter = 127
const checkpoints = [0, 30, 60, 90, 120]
const toolLabels = { plant: ['🌱', 'Plant'], water: ['💧', 'Water'], shovel: ['🪏', 'Shovel'], harvest: ['🌼', 'Harvest'] }
const flowerIcons = [['1f331', 'seedling'], ['1f337', 'tulip'], ['1f33c', 'blossom'], ['1f338', 'cherry blossom'], ['1f339', 'rose'], ['1f33b', 'sunflower'], ['1f33a', 'hibiscus'], ['1f4ae', 'white flower']]

function currentDay(garden) { const elapsed = Math.floor((Date.now() - new Date(garden.startedAt).getTime()) / 86400000); return Math.min(128, Math.max(1, elapsed + 1)) }
function showCharacter(value) { return value < 32 ? (value === 0 ? '' : '·') : String.fromCharCode(value) }
function rarity(value) { if (value < 30) return 'common'; if (value < 60) return 'unusual'; if (value < 90) return 'rare'; return 'strange' }
function refreshWater(garden) { const wateredToday = garden.lastWateredAt && new Date(garden.lastWateredAt).toDateString() === new Date().toDateString(); return wateredToday || garden.waterUsed === 0 ? garden : { ...garden, waterUsed: 0 } }
function farmerMessage(notice, day, collection) { if (notice) return notice; if (collection.length > 0) return `Lovely harvest. You have saved ${collection.length} little character${collection.length === 1 ? '' : 's'} in the archive.`; if (day === 1) return 'Welcome, grower. The first seed is NUL: quiet soil today, promise underneath.'; if (day >= 120) return 'The strange garden is nearly complete. Your characters have come a long way.'; if (day >= 90) return 'Your garden has a rare rhythm now. Keep a little room for surprises.'; return 'Choose a patch when you are ready. I will keep watch while you are away.' }

export default function App() {
  const [garden, setGarden] = useState(null)
  const [status, setStatus] = useState('loading')
  const [auth, setAuth] = useState(emptyAuth)
  const [mode, setMode] = useState('login')
  const [action, setAction] = useState('plant')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState(null)
  const [confirmingShovel, setConfirmingShovel] = useState(null)

  async function load() {
    try { const loaded = await getGarden(); const next = refreshWater(loaded); setGarden(next); if (next !== loaded) await saveGarden(next); setStatus('ready') }
    catch { setStatus('login') }
  }
  useEffect(() => { load() }, [])

  async function handleAuth(event) {
    event.preventDefault(); setError(null)
    try { setGarden(await (mode === 'login' ? login(auth) : signup(auth))); setStatus('ready') }
    catch (caught) { setError(caught) }
  }
  async function commit(next, message) {
    setGarden(next); setNotice(message)
    try { await saveGarden(next) } catch (caught) { setError(caught) }
  }
  async function confirmShovel() {
    const { bedIndex, slotIndex } = confirmingShovel
    const next = structuredClone(garden)
    next.beds[bedIndex].slots[slotIndex].plant = null
    setConfirmingShovel(null)
    return commit(next, 'Soil cleared. A fresh patch is ready.')
  }
  async function useAction(bedIndex, slotIndex) {
    const next = structuredClone(garden); const slot = next.beds[bedIndex].slots[slotIndex]
    if (action === 'plant') { if (slot.plant) return setNotice('That soil already has a plant.'); slot.plant = { value: 0, watered: false, plantedAt: new Date().toISOString() }; return commit(next, 'Seed planted. A tiny life is now under the soil.') }
    if (action === 'shovel') { if (!slot.plant) return setNotice('That patch is already empty.'); setConfirmingShovel({ bedIndex, slotIndex, value: slot.plant.value }); return }
    if (action === 'water') { if (!slot.plant) return setNotice('Plant a seed first.'); if (slot.plant.watered) return setNotice('This plant has had its water for today.'); if (next.waterUsed >= 3) return setNotice('Watering is finished for today.'); slot.plant.value = Math.min(maxCharacter, slot.plant.value + 1); slot.plant.watered = true; next.waterUsed += 1; next.lastWateredAt = new Date().toISOString(); return commit(next, 'Beautiful. Your character just evolved.') }
    if (action === 'harvest') { if (!slot.plant || slot.plant.value === 0) return setNotice('The seed is still below the soil.'); next.collection.unshift({ id: crypto.randomUUID(), value: slot.plant.value, rarity: rarity(slot.plant.value), harvestedAt: new Date().toISOString() }); slot.plant = null; return commit(next, 'Harvest stored. That little character made it into the archive.') }
  }
  useEffect(() => { if (!garden) return undefined; const reset = setInterval(() => setGarden((current) => current ? refreshWater(current) : current), 60000); return () => clearInterval(reset) }, [garden?.id])

  if (status === 'loading') return <main className="center"><p>Waking the garden...</p></main>
  if (status === 'login' || !garden) return <main className="auth-shell"><section className="auth-card"><p className="eyebrow">ASCII GARDEN / {mode === 'login' ? 'RETURN' : 'NEW PLOT'}</p><h1>Grow a character.</h1><p className="lede">A quiet garden that keeps time while you are away.</p><form onSubmit={handleAuth}><label htmlFor="username">Username</label><input id="username" value={auth.username} onChange={(event) => setAuth({ ...auth, username: event.target.value })} required maxLength={32} /><label htmlFor="password">Password</label><input id="password" type="password" value={auth.password} onChange={(event) => setAuth({ ...auth, password: event.target.value })} required minLength={6} />{mode === 'signup' && <><label htmlFor="gardenName">Garden name</label><input id="gardenName" value={auth.gardenName} onChange={(event) => setAuth({ ...auth, gardenName: event.target.value })} required maxLength={48} /></>}<button type="submit">{mode === 'login' ? 'Enter garden' : 'Plant my garden'}</button></form>{error && <p className="error" role="alert">{error.message}</p>}<button className="text-button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}>{mode === 'login' ? 'Make a new garden' : 'I already have a garden'}</button></section></main>

  const day = currentDay(garden); const unlocked = checkpoints.filter((point) => day >= point).length
  return <><main className="page"><header className="masthead"><div><p className="eyebrow">ASCII GARDEN / {garden.username}</p><h1>{garden.gardenName}</h1><p className="lede">Day {day} of 128. Your garden grows even when closed.</p></div><button className="text-button" onClick={() => { localStorage.removeItem('ascii-garden:account'); localStorage.removeItem('ascii-garden:id'); localStorage.removeItem('ascii-garden:session'); location.reload() }}>Leave</button></header><DemoNotice /><section className="garden-layout"><div className="garden-panel"><div className="panel-head"><div><p className="eyebrow">PLOT / {unlocked} OF 5 GARDEN BEDS</p><h2>Choose your patch</h2></div></div><div className="beds">{garden.beds.map((bed, bedIndex) => <section key={bed.id} className={`bed ${bed.locked && day < checkpoints[bedIndex] ? 'locked' : ''}`}><div className="bed-label"><span>GARDEN BED {String(bed.id).padStart(2, '0')}</span>{bed.locked && day < checkpoints[bedIndex] ? <span>LOCKED / DAY {checkpoints[bedIndex]}</span> : <span>OPEN</span>}</div><div className="slots">{bed.slots.map((slot, slotIndex) => { const stage = !slot.plant ? 'empty' : slot.plant.value >= 60 ? 'mature' : 'rooted'; return <button key={slot.id} className="slot" disabled={bed.locked && day < checkpoints[bedIndex]} onClick={() => useAction(bedIndex, slotIndex)}><span className={`soil ${stage}`}><span className="soil-pixels" aria-hidden="true">▪ ▪ ▪</span><span className={`plant-glyph ${stage}`} style={{ fontSize: slot.plant ? `${Math.min(2.8, 0.55 + slot.plant.value * 0.018)}rem` : '0.8rem' }}>{slot.plant ? showCharacter(slot.plant.value) : '✦'}</span></span><small>{slot.plant ? `char ${slot.plant.value}` : 'empty'}</small></button> })}</div></section>)}</div></div><aside className="side-panel"><div className="method"><p className="eyebrow">METHOD</p>{Object.entries(toolLabels).map(([item, [icon, label]]) => <button key={item} className={action === item ? 'active' : ''} onClick={() => setAction(item)}><span className="tool-icon" aria-hidden="true">{icon}</span><span>{label}</span>{item === 'water' && <span className="water-remaining">{Math.max(0, 3 - garden.waterUsed)} left</span>}</button>)}</div><div className="note"><p className="eyebrow">FARM ASSISTANT</p><p className="farmer-dialog"><span className="farmer-face" aria-hidden="true">🧑‍🌾</span>{farmerMessage(notice, day, garden.collection)}</p>{error && <p className="error">{error.message}</p>}</div></aside></section><section className="collection"><div className="panel-head"><div><p className="eyebrow">HARVEST COLLECTION</p><h2>Plant collection</h2></div><span>{garden.collection.length} saved</span></div>{garden.collection.length === 0 ? <p className="muted">Harvested characters will rest here.</p> : <div className="collection-grid">{garden.collection.map((plant) => { const [code, name] = flowerIcons[plant.value % flowerIcons.length]; return <article key={plant.id}><img className="flower-icon" src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${code}.svg`} alt={name} loading="lazy" /><span className="collection-char">{showCharacter(plant.value)}</span><div><strong>ASCII {plant.value}</strong><small>{plant.rarity} / {new Date(plant.harvestedAt).toLocaleDateString()}</small></div></article> })}</div>}</section></main>{confirmingShovel && <div className="confirm-backdrop" role="presentation"><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="shovel-title"><p className="eyebrow">SOIL CHANGE</p><h2 id="shovel-title">Remove this character?</h2><p>ASCII {confirmingShovel.value} will leave the patch and cannot be recovered.</p><div className="confirm-actions"><button className="text-button" onClick={() => setConfirmingShovel(null)}>Keep character</button><button className="danger-button" onClick={confirmShovel}>Shovel it</button></div></section></div>}</>
}
