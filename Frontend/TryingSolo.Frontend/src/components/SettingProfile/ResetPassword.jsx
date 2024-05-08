import { useNavigate } from "react-router-dom";
import useParseToken from "../../hooks/useParseToken";
import useUpdateToken from "../../hooks/useUpdateToken";
import api from "../../api/helpAxios";
import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthProvider";
import useRediresctionRefreshToken from "../../hooks/useRedirectionRefreshToken";
import styles from "./Profile.module.css"
import resetPassword from "../../assets/Profile/ResetPasword.jpg";
import Loading from "../Loading/Loading";
import Modal from "../ModalComponent/Modal";

const ResetPassword = () => {
    const errorMessgae = useRef(null);
    const { auth, setAuth } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        var fatchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const { id, login, role } = useParseToken(token);
                setAuth({ id, login, role });
                const response = await api.get(`/Profile/GetProfile/${id}`,
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                console.log(response);

                if (response.data.statusCode != 0) {
                    console.log(response.data.description);
                }

                setEmail(response.data.data.email);
            }
            catch (error) {
                if (error.request.status == 0) {

                    await useRediresctionRefreshToken(() => { fatchData() },
                        setAuth,
                        navigate,
                        useUpdateToken,
                        useParseToken);

                }
            }
        };

        fatchData();
    }, []);


    const ResetPassword = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const { id, login, role } = useParseToken(token);

            var response = await api.post("/Profile/ResetPassword", {
                idProfile: id
            },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

            console.log(response);

            if (response.data.statusCode == 9) {
                errorMessgae.current.textContent = "Email не существует измените и повторите попытку";
                return;
            }
            else if (response.data.statusCode != 0) {
                errorMessgae.current.textContent = response.data.description;
                return;
            }


            console.log(response);
            setModalIsOpen(true);
        }
        catch (error) {
            console.log(error);
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { ResetPassword(e) },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);

            }
        }
    }

    return (
        <div className={styles.resetPassword}>
            <div className={styles.resetPasswordImage}>
                <img src={resetPassword} alt="reset password" height={400} />
            </div>
            <form onSubmit={ResetPassword}>
                <div className={styles.resetPasswordForm}>
                    <div className={`${styles.inputElem} ${styles.resetPasswordData}`}>
                        <label>Email</label>
                        <div className={styles.inputContainer}><input defaultValue={email} className={styles.dataInput} type="text" readOnly={true} /></div>
                    </div>
                </div>

                <section className={styles.saveChanging}>
                    <button type="submit" className={styles.btn}>Сбросить пароль</button>
                </section>
                <Modal isOpen={modalIsOpen}
                    onClose={() => {setModalIsOpen(false)}}>
                    <h1>Письмо отправленно</h1>
                    <p>Проверьте почту для сброса пароля</p>
                </Modal>
            </form>

        </div>
    )
}

export default ResetPassword;