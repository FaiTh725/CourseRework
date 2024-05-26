import { useContext, useEffect } from "react";
import AuthContext from "../Context/AuthProvider";
//import { useCookies } from "react-cookie";
import api from "../../api/helpAxios";
import Cookies from "js-cookie";
import styles from "./Home.module.css";
import logo from "../../assets/Auth/logo.png"
import miniProfile from "../../assets/Auth/user.png"
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Files from "../Files/Files";
import Roles from "../Roles/Roles";
import Shedule from "../Shedule/Shedule";
import useParseToken from "../../hooks/useParseToken";
import useRediresctionRefreshToken from "../../hooks/useRedirectionRefreshToken";
import useUpdateToken from "../../hooks/useUpdateToken";


// при вводе пароля скрывать его и раскрывать
// получать от пользователя его аватарку и устанавливать
// поработать над рассылкой писем что бы они были красивые
const Home = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [profileImage, setProfileImage] = useState("");
    var c = Cookies.get("RefreshToken");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const [tab, setTab] = useState();

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const AwaitableSignOut = async () => {
        try {
            const id = auth.id;
            var response = await api.post("/Account/SignOut", {
                idUser: id
            }, {
                withCredentials: true
            });

            if (response.data.statusCode == 0) {
                localStorage.clear();
                setAuth({});
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const SignOut = async (e) => {
        e.preventDefault();
        await AwaitableSignOut();
        navigate("/Auth");

    }

    const GetImageProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const {id, login, role} = useParseToken(token);
            const response = await api.get(`/Profile/GetProfileImage/${id}`,
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.statusCode != 0) {
                console.log(response.data.description);
                return;
            }

            setProfileImage(response.data.data.imageName);
        }
        catch (error) {
            if (error.request.status == 0) {
                await useRediresctionRefreshToken(() => { GetImageProfile() },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
            }
        }
    }

    useEffect(() => {
        const fatchProfileImage = async () => {await GetImageProfile()}

        fatchProfileImage();
    }, []);

    return (
        <div className={styles.wrapper} onClick={handleClickOutside}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.logo}>
                        <Link to="/Home">
                            <img src={logo} alt="logo" height={80} />
                        </Link>
                    </div>
                    <nav className={styles.navigate}>
                        <ul>
                            {auth.role == "Methadist" || auth.role == "Admin" ? <li onClick={() => { setTab(<Files />) }}>файлы</li> : null}
                            {auth.role == "Admin" ? <li onClick={() => { setTab(<Roles />) }}>роли</li> : null}
                            <li onClick={() => { setTab(<Shedule />) }}>расписание</li>
                        </ul>
                    </nav>
                    <div className={styles.profile}>
                        <div className={styles.profileLogo} onClick={toggleMenu}>
                            <img src={profileImage == "" ? miniProfile : `data:image/png;base64,${profileImage}`} alt="miniprofile" height={60} width={60}/>
                            <span>{auth.login}</span>
                        </div>
                        {isMenuOpen && (
                            <div className={styles.menu} ref={menuRef}>
                                <div className={styles.menuInner}>
                                    <Link to="/Profile">Профиль</Link>
                                    <button type="button" onClick={SignOut}>Выйти</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main className={styles.main}>
                <section className={styles.welcome} >
                    <h1>Добро пожаловать</h1>
                    <h3>Узнай свое расписание на сегодня</h3>
                </section>
                <section className={styles.news}>
                </section>
            </main>
            <section className={styles.tab}>
                {tab}
            </section>
        </div>
    )
}

export default Home;