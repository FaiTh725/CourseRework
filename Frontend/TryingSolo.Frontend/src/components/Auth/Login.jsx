import { useContext, useEffect, useState } from "react"
import styles from "./Auth.module.css";
import Register from "./Register";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthProvider";
import api from "../../api/helpAxios";
import { jwtDecode } from "jwt-decode";
import useParseToken from "../../hooks/useParseToken";


const Login = ({SwithPage}) => {
    const [loginInput, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const {auth, setAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        var error = document.getElementById("error");
        error.textContent = "";
    }, [loginInput, password]);

    const sendRequest = async () => {
        setAuth({});
        try
        {
            var response = await api.post('/Account/Login', {
            login:loginInput,
            password:password
        },
        {
            withCredentials: true,    
        });

        console.log(response.data.description);
        if(response.data.statusCode !=0)
        {
            var error = document.getElementById("error");
            error.textContent = response.data.description;
            setAuth({});
            return;
        }
        localStorage.setItem(`token`, response.data.data.token);
        const token = response.data.data.token;
        const {id, login, role} = useParseToken(token);
        setAuth({id, login, role});
        navigate('/Home');
        }
        catch {
            console.log(error);
        }
    }

    const sendForm = async (e) => {
        e.preventDefault();
        try
        {
            await sendRequest();
        }
        catch(error) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={sendForm} className={styles.form}>
            <h2 >Log in</h2>
            <div>
                <div className={styles.inputData}>
                    <label htmlFor="login">Login</label>
                    <input onChange={(e) => {setLogin(e.target.value)}} type="text" id="login" placeholder="enter you login"/>
                </div>
                <div className={styles.inputData}>
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => {setPassword(e.target.value)}} type="password" id="password" placeholder="enter you password"/>
                    <label id="error"></label>
                </div>
                <div className={styles.btnContainer}>
                    <button type="submit" className={styles.btn}>Log In</button>
                    <button onClick={() => {SwithPage(<Register SwithPage={SwithPage}/>)}} type="button" className={styles.btn}>Registration</button>
                </div>
            </div>
        </form>
    )
}

export default Login
