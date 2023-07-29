import { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const { VITE_AUTH_API_URL } = import.meta.env

const retrieve = key => localStorage.getItem(key)
const store = (key, value) => localStorage.setItem(key, value)

const AuthContext = createContext({})

export const Auth = ({ children }) => {
  const [state, setState] = useState({
    ok: true,
    message: '',
    accessToken: '',
    authenticated: retrieve('refreshToken') ? true : false,
    refreshToken: retrieve('refreshToken') ?? '',
    refreshing: false
  })
  const [listeners, setListeners] = useState([])

  const subscribe = listener => {
    const newId = uuidv4()
    setListeners(listeners => [...listeners, { id: newId, listener }])
    return newId
  }

  const unsubscribe = id => {
    setListeners(listeners => listeners.filter(listener => listener.id !== id))
  }

  const set = newState => {
    if (typeof newState === 'function') setState(state => newState(state))
    else setState(state => ({ ...state, ...newState }))
  }

  const get = () => state

  useEffect(() => listeners.forEach(({ listener }) => listener(state)), [state])

  const passcode = async email => {
    try {
      const res = await fetch(`${VITE_AUTH_API_URL}/v1/passcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      const { ok, message } = await res.json()
      if (!ok) {
        set({ ok, message })
        return false
      }
      set({ ok, message })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const login = async (email, passcode) => {
    try {
      const res = await fetch(`${VITE_AUTH_API_URL}/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, passcode })
      })
      const { ok, message, data } = await res.json()
      if (!ok) {
        set({ ok, message })
        return false
      }
      set({
        ok,
        message,
        refreshToken: data.refreshToken
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const refresh = async () => {
    if (state.refreshing) return
    set(state => ({ ...state, refreshing: true }))
    try {
      const res = await fetch(`${VITE_AUTH_API_URL}/v1/refresh`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: state.refreshToken })
      })
      const { ok, message, data } = await res.json()
      if (!ok) {
        set({ ok, message, refreshToken: '', refreshing: false })
        return false
      }
      set({
        ok,
        message,
        refreshToken: data.refreshToken,
        accessToken: data.accessToken,
        refreshing: false
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const logout = async () => {
    try {
      const res = await fetch(`${VITE_AUTH_API_URL}/v1/logout`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: state.refreshToken })
      })
      const { ok, message } = await res.json()
      if (!ok) {
        set({ ...state, ok, message })
        return false
      }
      set({ ok, message, refreshToken: '' })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  useEffect(() => {
    state.refreshToken
      ? set({ authenticated: true })
      : set({ authenticated: false })
    store('refreshToken', state.refreshToken)
  }, [state.refreshToken])

  return (
    <AuthContext.Provider
      value={{
        subscribe,
        unsubscribe,
        set,
        get,
        passcode,
        login,
        logout,
        refresh
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const { subscribe, unsubscribe, set, get, passcode, login, logout, refresh } =
    useContext(AuthContext)
  const [state, setState] = useState(get())

  useEffect(() => {
    const id = subscribe(state => setState(state))
    return () => unsubscribe(id)
  }, [])

  return { state, set, passcode, login, logout, refresh }
}
