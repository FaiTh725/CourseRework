import { useRef, useState } from "react";
import resetPassword from "../../assets/ResetPassword/ResetPassword.jpg"
import styles from "./ResetPassword.module.css";
import api from "../../api/helpAxios";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

const ResetPassword = () => {
    const errorMessage = useRef(null);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const ResetPassword = async (e) => {
        e.preventDefault();

        if (password != repeatPassword) {
            errorMessage.current.textContent = "Пароли не совпадают";
            return;
        }
        else if (!password) {
            errorMessage.current.textContent = "Пароль обязателен";
            return;
        }
        else if (password.length < 4) {
            errorMessage.current.textContent = "Пароль короче 4";
            return;
        }
        else if (!/['a-zA-Z']/.test(password) || !/['0-9']/.test(password)) {
            errorMessage.current.textContent = "Пароль должен содержать 1 цифру и букву";
            return;
        }

        try {

            const parsed = queryString.parse(location.search, true);
            const token = parsed.token;
            const response = await api.post("/Profile/ResetPasswordConfirme", {
                password: password
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response);

            if (response.data.statusCode == 0) {
                navigate("/Auth");
            }
            else
            {
                errorMessage.current.textContent = resetPassword.data.description;
            }
        }
        catch (error) {
            if (error.request.status == 0) {
                errorMessage.current.textContent = "Ссылка не действительная"
            }
        }
    }

    return (
        <form onSubmit={ResetPassword} className={styles.main}>
            <section>
                <img src={resetPassword} alt="Reset Password" height={550} />
            </section>

            <section className={styles.inputData}>
                <div>
                    <label htmlFor="NewPassword">Новый пароль</label>
                    <input onChange={(e) => { setPassword(e.target.value) }} type="text" id="NewPassword" placeholder="новый пароль" />
                </div>
                <div>
                    <label htmlFor="RepeatPassword">Повторите пароль</label>
                    <input onChange={(e) => { setRepeatPassword(e.target.value) }} type="text" id="RepeatPassword" placeholder="повторите пароль" />
                </div>
                <div>
                    <label className={styles.errorMessage} ref={errorMessage}></label>
                </div>
                <button type="submit" className={styles.btn}>Изменить</button>
            </section>
        </form>

    )
};

export default ResetPassword;
