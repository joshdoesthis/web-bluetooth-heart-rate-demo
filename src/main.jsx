import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FluentProvider theme={teamsLightTheme}>
      <App />
    </FluentProvider>
  </React.StrictMode>
)
