import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import './reset.css'
// import './App.css'
import Auth from './components/Auth/Auth'
import ProtectedRoute from './components/Context/ProtectedRoute'
import Home from './components/Home/MainPage'
import { AuthProvider } from './components/Context/AuthProvider'
import Roles from './components/Roles/Roles'
import RoleInvalid from './components/PageError/RoleInvalid'
import NotFoundPage from './components/PageError/NotFoundPage'
import RoleProtectedRoute from './components/Context/RoleProtectedRote'
import Files from './components/Files/Files'
import Profile from './components/SettingProfile/Profile'
import ResetPassword from './components/ResetPassword/ResetPassword'
import Shedule from './components/Shedule/Shedule'


function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route exact path='/ResetPassword' element={<ResetPassword/>}/>
          <Route exact path='/Auth' element={<Auth/>}/>
          <Route exact path='*' element={<NotFoundPage/>}/>
          <Route exact path='/RoleError' element={<RoleInvalid />} />
          {/* перенести файлы в раздел для методистов и админов */}
          <Route exact path='/Files' element={<Files/>}/> 
          <Route exact path='/Profile' element={<Profile/>}/>
          <Route exact path='/Shedule' element= {<Shedule/>}/>
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
