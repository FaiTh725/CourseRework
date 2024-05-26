import styles from "./Roles.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import miniProfile from "../../assets/Auth/user.png";
import api from "../../api/helpAxios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthProvider";
import useUpdateToken from "../../hooks/useUpdateToken";
import useParseToken from "../../hooks/useParseToken";
import Search from "../Search/Search";
import useRediresctionRefreshToken from "../../hooks/useRedirectionRefreshToken";

const Roles = () => {
    const [users, setUsers] = useState([]);
    const [usersVisual, setUsersVisual] = useState([]);
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

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

            if (response.data.statusCode != 0) {
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

                await useRediresctionRefreshToken(() => { GetAllUser() },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);

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

            if (response.data.statusCode != 0) {
                var error = document.getElementById("error");
                error.textContent = response.data.description;
                return;
            }

            console.log(response);
        }
        catch (error) {
            if (error.request.status == 0) {

                await useRediresctionRefreshToken(() => { ChangeUserRoleHandler(id, newRole) },
                    setAuth,
                    navigate,
                    useUpdateToken,
                    useParseToken);
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
            <Search HandleFilter={HandleFilterUsers} placeholder="Поиск по логину"/>
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
            <div className={styles.imageContainer}>
                <img src={user.imageProfile == "" ? miniProfile : `data:image/png;base64,${user.imageProfile}`} alt="miniLogo" height={90} width={90}/>
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