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
import RoleInvalid from './components/PageError/RoleInvalid'
import NotFoundPage from './components/PageError/NotFoundPage'
import RoleProtectedRoute from './components/Context/RoleProtectedRote'
import Files from './components/Files/Files'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route exact path='/Auth' element={<Auth/>}/>
          <Route exact path='*' element={<NotFoundPage/>}/>
          <Route exact path='/RoleError' element={<RoleInvalid />} />
          <Route exact path='/Files' element={<Files/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route exact path='/Home' element={<Home/>}/>
            <Route element={<RoleProtectedRoute role={["Admin"]}/>}>
              <Route exact path='/Roles' element={<Roles/>}/>
            </Route>
            
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
