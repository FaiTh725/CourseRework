import { useContext, useEffect } from "react"
import AuthContext from "./AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RoleProtectedRoute = ({role}) => {
    const {auth, setAuth} = useContext(AuthContext);
    const location = useLocation();

    if(!role.includes(auth.role))
    {
        return <Navigate to="/RoleError" state={{from: location}}/>
    }
    
    return <Outlet/>
}

export default RoleProtectedRoute