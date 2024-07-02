import { createRoot } from 'react-dom/client'
import { Leva } from 'leva'
import { App } from './App'
import './styles.css'

export function Overlay() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%'
      }}>
      <div style={{ position: 'absolute', bottom: 40, left: 40, fontSize: '13px' }}>draft #1</div>
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          fontSize: '13px'
        }}>
        24/04/2023
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Overlay />
    <Leva collapsed />
  </>
)

screen.orientation.unlock()
