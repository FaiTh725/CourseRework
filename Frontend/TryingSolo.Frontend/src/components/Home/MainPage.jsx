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

// добавить функцию выбрать избранымм
// при вводе пароля скрывать его и раскрывать
// сделать само расписание
// функции которые я выбрал лежат в mistral ai 
// получать от пользователя его аватарку и устанавливать
const Home = () => {
    const {auth, setAuth} = useContext(AuthContext);
    var c = Cookies.get("RefreshToken");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    // const [load, setLoad] = useState(true);
    // const [data, setData] = useState({});

    const testRefreshToken = async (e) => {
        e.preventDefault();

        try{        
            var response = await api.get('/Home/Index', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            //console.log(response);
        }
        catch(error) {
            console.log(error);
        }
    }



    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const AwaitableSignOut = async() => {
        try{
            const id = auth.id;
            var response = await api.post("/Account/SignOut",{
                idUser:id
            },{
                withCredentials:true
            });

            if(response.data.statusCode == 0)
            {
                localStorage.clear();
                setAuth({});
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    const SignOut = async (e) => {
        e.preventDefault();
        await AwaitableSignOut();
        navigate("/Auth");

    }


    // useEffect(() => {
    //     console.log("1234");
    // }, []);

    // useEffect(() => {
    //     setLoad(false);
    // }, [data]);

    return (
        <div className={styles.wrapper} onClick={handleClickOutside}>
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <div className={styles.logo}>
                    <Link to="/Home">
                        <img src={logo} alt="logo" height={80}/>
                    </Link>
                </div>
                <nav className={styles.navigate}>
                    <ul>
                        {auth.role == "Methadist" || auth.role == "Admin"? <li><a href="#">файлы</a></li> : null}
                        {auth.role == "Admin"? <li><a href="#">роли</a></li> : null}
                    </ul>
                </nav>
                <div className={styles.profile}>
                    <div className={styles.profileLogo} onClick={toggleMenu}>
                        <img src={miniProfile} alt="miniprofile" height={50}/>
                        <span>{auth.login}</span>
                    </div>
                {isMenuOpen && (
                    <div className={styles.menu} ref={menuRef}>
                        <div className={styles.menuInner}>
                            <a href="#">Профиль</a>
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
    </div>
    )
}

export default Home;