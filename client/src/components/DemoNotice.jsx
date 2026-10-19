import { USING_MOCK_API } from '../api'

// Make browser-only storage visible while mock mode is active.
export default function DemoNotice() {
  if (!USING_MOCK_API) return null

  return (
    <div className="demo-notice" role="status">
      <strong>Local demo.</strong> This garden is stored in this browser until the API is connected.
    </div>
  )
}
