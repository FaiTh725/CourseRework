import avatar from "../../assets/Auth/user.png";
import user from "../../assets/Profile/user.png";
import mail from "../../assets/Profile/mail.png";
import date from "../../assets/Profile/date.png";
import { useNavigate } from "react-router-dom";
import useParseToken from "../../hooks/useParseToken";
import useUpdateToken from "../../hooks/useUpdateToken";
import api from "../../api/helpAxios";
import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthProvider";
import useRediresctionRefreshToken from "../../hooks/useRedirectionRefreshToken";
import styles from "./Profile.module.css"
import ReactInputMask from "react-input-mask";
import Loading from "../Loading/Loading";

const PersonalData = () => {
    const [fullname, setFullName] = useState("");
    const [email, setMail] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [about, setAbout] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const { auth, setAuth } = useContext(AuthContext);
    const [uploadFile, setUploadFile] = useState(null);
    const imgBtn = useRef(null);
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);

    const SaveChanging = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const { id, login, role } = useParseToken(token);
            console.log(uploadFile);

            const request = {
                "About": about,
                "FullName": fullname,
                "BirthDay": birthDay,
                "Email": email,
                "ProfileId": id
            }

            var response = await api.post("/Profile/UpdateProfile",
                request,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

            console.log(response);

            if (uploadFile != null) {
                var file = new FormData();
                file.append("file", uploadFile);
                file.append("idUser", id);

                var responseUpdateImage = await api.post("/Profile/UpdateProfileImage",
                    file,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                console.log(responseUpdateImage);
            }

        }
        catch (error) {
            if (error.request.status == 0) {

                await useRediresctionRefreshToken(() => { SaveChanging(e) },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }


    useEffect(() => {
        setLoad(false);
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

                setFullName(response.data.data.fullName);
                setAbout(response.data.data.about);
                setBirthDay(response.data.data.birthDay);
                setMail(response.data.data.email);

                setProfileImage(response.data.data.base64Image);

                setLoad(true);
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
        <>
            {!load ? (
                <Loading />
            ) : (
                <form onSubmit={SaveChanging} className={styles.personalDataContainer}>
                    <section className={styles.general}>
                        <div className={styles.inputElem}>
                            <label>Имя</label>
                            <div className={styles.input}>
                                <div className={styles.imgContainer}><img src={user} alt="name" height={30} /></div>
                                <div className={styles.inputContainer}>
                                    <input onChange={(e) => setFullName(e.target.value)} defaultValue={fullname} className={styles.dataInput} type="text" placeholder="Полное имя" />
                                </div>
                            </div>
                        </div>
                        <div className={styles.inputElem}>
                            <label>Почта</label>
                            <div className={styles.input}>
                                <div className={styles.imgContainer}><img src={mail} alt="email" height={30} /></div>
                                <div className={styles.inputContainer}><input onChange={(e) => setMail(e.target.value)} defaultValue={email} className={styles.dataInput} type="email" placeholder="example@email.ru" /></div>
                            </div>
                        </div>

                        <div className={styles.inputElem}>
                            <label>Дата рождения</label>
                            <div className={styles.input}>
                                <div className={styles.imgContainer}><img src={date} alt="birthDay" height={30} /></div>
                                <div className={styles.inputContainer}><ReactInputMask onChange={(e) => setBirthDay(e.target.value)} value={birthDay} className={styles.dataInput} mask="99.99.9999" maskChar=" " type="data" placeholder="dd.mm.yyyy" /></div>
                            </div>
                        </div>
                    </section>
                    <section className={styles.about}>
                        <div >
                            <input className={styles.fileInput} accept=".png" type="file" ref={imgBtn} onChange={(e) => setUploadFile(e.target.files[0])} />
                            {/* <img src={uploadFile == null ? avatar : URL.createObjectURL(uploadFile)} onClick={() => { imgBtn.current.click(); }} alt="personalImage" height={150} /> */}
                            <img src={uploadFile == null ? profileImage == "" ? avatar : `data:image/png;base64,${profileImage}` : URL.createObjectURL(uploadFile)} onClick={() => { imgBtn.current.click(); }} alt="personalImage" height={150} />
                            <p>{auth.login}</p>
                            <p>{auth.role?.toUpperCase()}</p>
                        </div>
                        <div className={styles.inputElem}>
                            <label>О себе</label>
                            <div className={styles.input}>
                                <div className={styles.inputContainer}><textarea onChange={(e) => setAbout(e.target.value)} defaultValue={about} className={styles.dataInput} placeholder="О себе"></textarea></div>
                            </div>
                        </div>
                    </section>
                    <section className={styles.saveChanging}>
                        <button type="submit" className={styles.btn}>Сохранить</button>
                    </section>
                </form>
            )}
        </>

    )
}

export default PersonalData;