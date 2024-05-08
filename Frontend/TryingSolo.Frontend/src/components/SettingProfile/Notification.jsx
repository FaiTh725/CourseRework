import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthProvider";
import useRediresctionRefreshToken from "../../hooks/useRedirectionRefreshToken";
import styles from "./Profile.module.css"
import notification from "../../assets/Notification/notification1jpg.jpg"
import circleBlack from "../../assets/Notification/circleBlack.png"
import circleWhite from "../../assets/Notification/circleWhite.png"
import { useNavigate } from "react-router-dom";
import useParseToken from "../../hooks/useParseToken";
import useUpdateToken from "../../hooks/useUpdateToken";
import api from "../../api/helpAxios";
import { HubConnectionBuilder } from "@microsoft/signalr";


const Notitifcation = () => {
    const [notificationEmail, setNotificationEmail] = useState(false);
    const errorMessage = useRef(null);
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const NotificationByEmail = async (e) => {
        e.preventDefault();
        setNotificationEmail(!notificationEmail);

        try {
            const token = localStorage.getItem("token");
            const { id, login, role } = useParseToken(token);
            const response = await api.post("/Profile/NotificationEmail",
                {
                    idProfile: id
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.statusCode != 0) {
                errorMessage.current.textContent = resetPassword.data.description;
            }

            console.log(response);
        }
        catch (error) {
            if (error.request.status == 0) {

                await useRediresctionRefreshToken(() => { NotificationByEmail(e) },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);

            }
        }
    }

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

                setNotificationEmail(response.data.data.notificationEmail);
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

    return (
        <div className={styles.notificationMain}>
            <section>
                <img src={notification} height={400} alt="notification img" />
            </section>
            <section className={styles.notificationData}>
                <div className={styles.notificationInput}>
                    <label>Рассылка по почте</label>
                    <button className={notificationEmail ? styles.buttonChecked : styles.btnNotification} type="button" onClick={NotificationByEmail}>
                        <img src={notificationEmail ? circleWhite : circleBlack} alt="circle" height={17} />
                    </button>
                </div>
                <div>
                    <label ref={errorMessage}></label>
                </div>
            </section>
        </div>
    );
}

export default Notitifcation;