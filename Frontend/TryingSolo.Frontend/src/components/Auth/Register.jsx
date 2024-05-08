import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css"
import Login from "./Login"
import { useEffect, useState } from "react";
import api from "../../api/helpAxios";
import useParseToken from "../../hooks/useParseToken";

const Register= ({SwithPage}) => {
    const [loginInput, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        var error = document.getElementById("error");
        error.textContent = "";
    }, [loginInput, password, repeatPassword]);

    const sendRequest = async () => {
        try
        {
            var response = await api.post('/Account/Register', {
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
            return;
        }
        localStorage.setItem(`token`, response.data.data.token);
        const token = response.data.data.token;
        const {id, login, role} = useParseToken(token);
        setAuth({id, login, role});
        navigate('/Home');
        }
        catch(error) {
            console.log(error);
        }
    }

    const sendForm = async (e) => {
        e.preventDefault();
        try
        {
            if(password != repeatPassword)
            {
                var error = document.getElementById("error");
                error.textContent = "Пароли не совпадают";
                return;
            }
            else if(!loginInput || !password)
            {
                var error = document.getElementById("error");
                error.textContent = "Пароль и логин обязательны";
                return;
            }
            else if(loginInput.length<4 || password.length<4)
            {
                var error = document.getElementById("error");
                error.textContent = "Пароль или логин короче 4";
                return;
            }
            else if(!/['a-zA-Z']/.test(password) || !/['0-9']/.test(password))
            {
                var error = document.getElementById("error");
                error.textContent = "Пароль должен содержать 1 цифру и букву";
                return;
            }
            
            await sendRequest();
            
        }
        catch(error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={sendForm} className={styles.form}>
            <button type="button" onClick={() => {SwithPage(<Login SwithPage={SwithPage}/>)}} className={`${styles.btn} ${styles.btnBack}`}>Back</button>
            <h2 >Registration</h2>
            <div>
                <div className={styles.inputData}>
                    <label htmlFor="login">Login</label>
                    <input onChange={(e) => {setLogin(e.target.value)}} type="text" id="login" placeholder="enter you login"/>
                </div>
                <div className={styles.inputData}>
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => {setRepeatPassword(e.target.value)}} type="text" id="password" placeholder="enter you password"/>
                </div>
                <div className={styles.inputData}>
                    <label htmlFor="repeatPassword">Repeat Password</label>
                    <input onChange={(e) => {setPassword(e.target.value)}} type="text" id="repeatPassword" placeholder="repeat password"/>
                    <label id="error"></label>
                </div>
                <div className={styles.btnContainer}>
                    <button type="submit" className={styles.btn}>Registration</button>
                </div>
            </div>
        </form>
    )
}

export default Register