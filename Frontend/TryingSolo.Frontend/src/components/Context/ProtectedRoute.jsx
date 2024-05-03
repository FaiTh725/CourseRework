import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "./AuthProvider";
import Loading from "../Loading/Loading";
import useParseToken from "../../hooks/useParseToken";

const ProtectedRoute = () => {
    const {auth, setAuth} = useContext(AuthContext);
    const [load, setLoad] = useState(true);
    const location = useLocation();

    useEffect(() => {
        var token = localStorage.getItem('token');
        if (!token) {

            return <Navigate to="/Auth" state={{from: location}}/>;
        }
        const {id, login, role} = useParseToken(token);
        console.log(login);
        setAuth({ id, login, role });
        setLoad(false);
    }, []);
    
    if(load == true)
    {
        return (
            <Loading/>
        )
    }

    return (
        auth?.login ? <Outlet/> : <Navigate to='/Auth' state={{from: location}}/>
    )
}

export default ProtectedRoute;