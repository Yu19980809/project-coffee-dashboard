import { Suspense } from 'react'
import { ColorModeContext, useMode } from './theme'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import Login from './pages/Login'
import MainContent from './pages/MainContent'

const App = () => {
  const [theme, colorMode] = useMode()

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Routes>
          <Route path='/login' element={<Login />} />

          <Route path='/*' element={
            !JSON.parse(localStorage.getItem('userInfo'))
            ? <Navigate to='/login' />
            : <Suspense><MainContent /></Suspense>
          } />
        </Routes>

      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App