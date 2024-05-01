import { Outlet, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "./AuthProvider";
import Loading from "../Loading/Loading";
import api from "../../api/helpAxios";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
    const {auth, setAuth} = useContext(AuthContext);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        var token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        var tokenInfo = jwtDecode(token);
        const login = tokenInfo.name;
        const id = tokenInfo.sub;
        const role = tokenInfo.Role;
        console.log(login);
        setAuth({ id, login, role });
        setLoad(false);
    }, []);
    
    // useEffect(() => {
    //     setLoad(false);
    // }, [auth]);

    if(load == true)
    {
        return (
            <Loading/>
        )
    }

    return (
        auth?.login ? <Outlet/> : <Navigate to='/Auth' replace/>
    )
}

export default ProtectedRoute;