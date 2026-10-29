import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Store } from '../provider/store'
import Main from './main'
import NotFound from './404'
import './index.css'

// The demo has one page, so anything other than the home path is a 404.
const isHome = () => {
  const base = import.meta.env.BASE_URL
  const path = window.location.pathname
  return path === base || path === `${base}index.html`
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Store>{isHome() ? <Main /> : <NotFound />}</Store>
  </StrictMode>
)
