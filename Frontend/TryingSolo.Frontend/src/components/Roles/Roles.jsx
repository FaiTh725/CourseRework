import styles from "./Roles.module.css";
import { Profiler, useContext, useEffect, useRef, useState } from "react";
import miniProfile from "../../assets/Auth/user.png";
import api from "../../api/helpAxios";
import Loading from "../Loading/Loading";
import { json, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../Context/AuthProvider";
import useUpdateToken from "../../hooks/useUpdateToken";
import useParseToken from "../../hooks/useParseToken";

const Roles = () => {
    const [isFocused, setIsFocused] = useState(false);
    const innerSearch = useRef(null);
    const [users, setUsers] = useState([]);
    const [usersVisual, setUsersVisual] = useState([]);
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        if (isFocused == true) {
            console.log("focus");
            innerSearch.current.style.backgroundColor = "#ffffffc4";
            innerSearch.current.style.boxShadow = "0px 0px 8px #b6b4b49a";
        }
        else {
            console.log("unfocus");
            innerSearch.current.style.backgroundColor = "#e7e7e75e";
            innerSearch.current.style.boxShadow = "none";

        }

    }, [isFocused]);

    const GetAllUser = async () => {
        try {


            const token = localStorage.getItem("token");
            //console.log(token);
            var response = await api.get('/Home/GetAllUsers', {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    token: token
                }
            });

            if (response.data.statusCode == 4) // если токен истек
            {
                localStorage.removeItem("token");
                setAuth({});
                navigate("/Auth");
            }
            else if (response.data.statusCode != 0) {
                var error = document.getElementById("error");
                error.textContent = response.data.description;
                return;
            }
            console.log(response);
            setUsers(response.data.data.users);
            setUsersVisual(response.data.data.users);
            // console.log(users);
        }
        catch (error) {
            if (error.request.status == 0) {
                console.log("Переадрисация на получение токена");

                const { tokenSmall, tokenBig } = await useUpdateToken();

                console.log(`${tokenSmall} - ${tokenBig}`);

                if (tokenSmall == null || tokenBig == null) {
                    localStorage.removeItem("token");
                    setAuth({});
                    navigate("/Auth");
                }
                const { id, login, role } = useParseToken(tokenSmall);

                localStorage.setItem("token", tokenSmall);
                setAuth({ id, login, role });

                await GetAllUser();

            }

        }
    }



    useEffect(() => {
        GetAllUser();
    }, []);

    const ChangeUserRoleHandler = async (id, newRole) => {
        try {
            console.log(`${id} - ${newRole}`);
            const token = localStorage.getItem("token");

            var response = await api.post("/Home/SwithRole", {
                token: token,
                idUser: id,
                role: newRole
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.statusCode == 4) // если токен истек
            {
                localStorage.removeItem("token");
                setAuth({});
                navigate("/Auth");
            }
            else if (response.data.statusCode != 0) {
                var error = document.getElementById("error");
                error.textContent = response.data.description;
                return;
            }

            console.log(response);
        }
        catch (error) {
            if (error.request.status == 401) {
                console.log("Переадрисация на получение токена");

                const { tokenSmall, tokenBig } = await useUpdateToken();

                console.log(`${tokenSmall} - ${tokenBig}`);

                if (tokenSmall == null || tokenBig == null) {
                    localStorage.removeItem("token");
                    setAuth({});
                    navigate("/Auth");
                }
                const { id, login, role } = useParseToken(tokenSmall);

                localStorage.setItem("token", tokenSmall);
                setAuth({ id, login, role });

                ChangeUserRoleHandler(id, newRole);
            }
        }

    }

    const HandleFilterUsers = (e) => {
        var value = e.target.value;

        setUsersVisual(users.filter(function (s) {
            return s.login.startsWith(value);
        }));
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.headerText}>Setting Roles</h1>
            <div className={styles.error}>
                <label id="error"></label>
            </div>
            <section className={styles.search}>
                <div className={styles.searchInner} ref={innerSearch}>
                    <button className={styles.btnSearch}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="60" height="60" viewBox="0 0 128 128">
                            <path d="M 56.599609 21.599609 C 34.099609 21.599609 15.800781 40.100781 15.800781 62.800781 C 15.800781 85.600781 34.099609 104 56.599609 104 C 66.899609 104 76.3 100.09922 83.5 93.699219 L 85.800781 96 L 83.699219 98.199219 C 82.499219 99.399219 82.499219 101.3 83.699219 102.5 L 101.69922 120.69922 C 102.29922 121.29922 103.00078 121.59961 103.80078 121.59961 C 104.60078 121.59961 105.40039 121.29922 105.90039 120.69922 L 113.90039 112.59961 C 115.00039 111.39961 115.00078 109.50039 113.80078 108.40039 L 95.800781 90.199219 C 95.200781 89.599219 94.499219 89.300781 93.699219 89.300781 C 92.899219 89.300781 92.099609 89.599219 91.599609 90.199219 L 89.5 92.400391 L 87.199219 90 C 93.499219 82.7 97.400391 73.200781 97.400391 62.800781 C 97.400391 40.100781 79.099609 21.599609 56.599609 21.599609 z M 56.599609 27.699219 C 75.799609 27.699219 91.400391 43.500391 91.400391 62.900391 C 91.400391 82.300391 75.799609 98 56.599609 98 C 37.399609 98 21.800781 82.300391 21.800781 62.900391 C 21.800781 43.500391 37.399609 27.699219 56.599609 27.699219 z M 56.699219 40.199219 C 47.199219 40.199219 38.7 46.300781 35.5 55.300781 C 35 56.600781 35.699609 58.199609 37.099609 58.599609 C 37.399609 58.699609 37.7 58.800781 38 58.800781 C 39.1 58.800781 40.1 58.1 40.5 57 C 42.9 50.1 49.499219 45.400391 56.699219 45.400391 C 58.099219 45.400391 59.300781 44.200781 59.300781 42.800781 C 59.300781 41.400781 58.099219 40.199219 56.699219 40.199219 z M 37.699219 64.900391 C 36.299219 64.900391 35.099609 66 35.099609 67.5 L 35.099609 67.900391 C 35.199609 69.300391 36.300781 70.5 37.800781 70.5 C 39.200781 70.5 40.400391 69.300391 40.400391 67.900391 L 40.400391 67.599609 C 40.400391 66.099609 39.300781 64.900391 37.800781 64.900391 L 37.699219 64.900391 z M 93.800781 96.599609 L 107.59961 110.59961 L 103.80078 114.40039 L 90 100.40039 L 93.800781 96.599609 z"></path>
                        </svg>
                    </button>
                    <input type="text" onChange={(e) => {HandleFilterUsers(e)}} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="поиск по логину" />
                </div>
            </section>
            <section>
                <label id="error"></label>
            </section>
            <section className={styles.roles}>
                {usersVisual.map(user => (
                    <UserComponent key={user.id} user={user} ChangeUserRole={(e) => ChangeUserRoleHandler(user.id, e.target.value)} />
                ))}
            </section>
        </div>
    )
}

const UserComponent = ({ user, ChangeUserRole }) => {
    return (
        <div className={styles.userVisual} key={user.id}>
            <div>
                <img src={miniProfile} alt="miniLogo" height={90} />
            </div>
            <div className={styles.info}>
                <p>{user.id}</p>
            </div>
            <div className={styles.info}>
                <p>{user.login}</p>
            </div>
            <select className={styles.selector} defaultValue={user.role} onChange={ChangeUserRole}>
                <option value={0}>User</option>
                <option value={1}>Methodist</option>
                <option value={2}>Admin</option>
            </select>
        </div>
    )
}

export default Roles;