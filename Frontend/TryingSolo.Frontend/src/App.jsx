import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import './reset.css'
// import './App.css'
import Auth from './components/Auth/Auth'
import ProtectedRoute from './components/Context/ProtectedRoute'
import Home from './components/Home/MainPage'
import { AuthProvider } from './components/Context/AuthProvider'
import { useCookies } from 'react-cookie'
import api from './api/helpAxios'
import Roles from './components/Roles/Roles'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route exact path='/Auth' element={<Auth/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route exact path='/Home' element={<Home/>}/>
            <Route exact path='/Roles' element={<Roles/>}/>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
