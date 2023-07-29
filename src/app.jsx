import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Router, Route } from '@joshdoesthis/react-router'
import { Store } from '../provider/store'
import { Auth } from '../provider/auth'
import { Theme } from '@joshdoesthis/react-ui'
import Main from './main'
import NotFound from './404'

const App = () => {
  return (
    <Router>
      <Route path='/' exact component={Main} />
      <Route path='/404' component={NotFound} />
    </Router>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth>
      <Store>
        <Theme>
          <App />
        </Theme>
      </Store>
    </Auth>
  </StrictMode>
)
